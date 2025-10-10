require 'feedjira'
require 'httparty'
require 'jekyll'
require 'nokogiri'
require 'time'

module ExternalPosts
  class ExternalPostsGenerator < Jekyll::Generator
    safe true
    priority :high

    def generate(site)
      sources = site.config['external_sources']
      return if sources.nil? || !sources.respond_to?(:each)

      sources.each do |src|
        name = (src['name'] || '').to_s.strip
        puts "Fetching external posts from #{name}:"

        if present_url?(src['rss_url'])
          fetch_from_rss(site, src)
        elsif src['posts'].is_a?(Array)
          fetch_from_urls(site, src)
        else
          # nothing to fetch
          next
        end
      end
    end

    def fetch_from_rss(site, src)
      url = src['rss_url']
      return unless present_url?(url)

      begin
        response = HTTParty.get(url)
        xml = response&.body
        return if xml.nil? || xml.strip.empty?
        feed = Feedjira.parse(xml)
        entries = feed.respond_to?(:entries) ? feed.entries : []
        process_entries(site, src, entries)
      rescue StandardError => e
        Jekyll.logger.warn "ExternalPosts", "Failed to fetch RSS from #{url}: #{e.class} #{e.message}"
      end
    end

    def process_entries(site, src, entries)
      entries.each do |e|
        puts "...fetching #{e.url}"
        create_document(site, src['name'], e.url, {
          title: e.title,
          content: e.content,
          summary: e.summary,
          published: e.published
        })
      end
    end

    def create_document(site, source_name, url, content)
      # check if title is composed only of whitespace or foreign characters
      if content[:title].gsub(/[^\w]/, '').strip.empty?
        # use the source name and last url segment as fallback
        slug = "#{source_name.downcase.strip.gsub(' ', '-').gsub(/[^\w-]/, '')}-#{url.split('/').last}"
      else
        # parse title from the post or use the source name and last url segment as fallback
        slug = content[:title].downcase.strip.gsub(' ', '-').gsub(/[^\w-]/, '')
        slug = "#{source_name.downcase.strip.gsub(' ', '-').gsub(/[^\w-]/, '')}-#{url.split('/').last}" if slug.empty?
      end

      path = site.in_source_dir("_posts/#{slug}.md")
      doc = Jekyll::Document.new(
        path, { :site => site, :collection => site.collections['posts'] }
      )
      doc.data['external_source'] = source_name
      doc.data['title'] = content[:title]
      doc.data['feed_content'] = content[:content]
      doc.data['description'] = content[:summary]
      doc.data['date'] = content[:published]
      doc.data['redirect'] = url
      doc.content = content[:content]
      site.collections['posts'].docs << doc
    end

    def fetch_from_urls(site, src)
      posts = src['posts']
      return unless posts.is_a?(Array)

      posts.each do |post|
        url = (post['url'] || '').to_s.strip
        next unless present_url?(url)

        puts "...fetching #{url}"
        content = fetch_content_from_url(url)
        content[:published] = safe_published_date(post['published_date'])
        create_document(site, src['name'], url, content)
      end
    end

    def safe_published_date(published_date)
      case published_date
      when String
        Time.parse(published_date).utc rescue Time.now.utc
      when Date
        published_date.to_time.utc
      when Time
        published_date.utc
      else
        Time.now.utc
      end
    end

    def fetch_content_from_url(url)
      begin
        response = HTTParty.get(url)
        html = response&.body.to_s
        parsed_html = Nokogiri::HTML(html)

        title = parsed_html.at('head title')&.text.to_s.strip
        description = parsed_html.at('head meta[name="description"]')&.attr('content')
        description ||= parsed_html.at('head meta[name="og:description"]')&.attr('content')
        description ||= parsed_html.at('head meta[property="og:description"]')&.attr('content')

        body_content = parsed_html.search('p').map { |e| e.text.to_s }.join

        {
          title: title,
          content: body_content,
          summary: description
          # published is set by caller
        }
      rescue StandardError => e
        Jekyll.logger.warn "ExternalPosts", "Failed to fetch content from #{url}: #{e.class} #{e.message}"
        { title: '', content: '', summary: '' }
      end
    end

    private

    def present_url?(url)
      s = (url || '').to_s.strip
      return false if s.empty?
      # accept http/https only
      s.start_with?('http://', 'https://')
    end

  end
end
