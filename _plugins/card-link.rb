module Jekyll
  module CardLinkFilter
    def card_link(card_name)
      # Convert card name to URL-safe format
      # "Coy Nixie" -> "coy-nixie"
      slug = card_name.downcase.strip.gsub(/\s+/, '-').gsub(/[^\w-]/, '')
      
      # Generate the link
      %(<a href="https://curiosa.io/cards?search=#{slug}">#{card_name}</a>)
    end
  end
end

Liquid::Template.register_filter(Jekyll::CardLinkFilter)
