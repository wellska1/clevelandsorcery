// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "about",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-blog",
          title: "blog",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/blog/";
          },
        },{id: "nav-decks",
          title: "decks",
          description: "A growing collection of your cool decks.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/decks/";
          },
        },{id: "nav-repositories",
          title: "repositories",
          description: "Edit the `_data/repositories.yml` and change the `github_users` and `github_repos` lists to include your own GitHub profile and repositories.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/repositories/";
          },
        },{id: "nav-people",
          title: "people",
          description: "members of the lab or group",
          section: "Navigation",
          handler: () => {
            window.location.href = "/people/";
          },
        },{id: "post-cornerstone-october-2025",
        
          title: "Cornerstone October 2025",
        
        description: "CCR&#39;s October 2025 Cornerstone Event",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/10/11/Cornerstone/";
          
        },
      },{id: "decks-starter-blue-deck",
          title: 'Starter Blue Deck',
          description: "A beginner-friendly blue control deck focused on card draw and countering threats",
          section: "Decks",handler: () => {
              window.location.href = "/decks/starter-blue/";
            },},{id: "news-cornerstone-event-today-https-play-sorcerytcg-com-events-f385d0f4-c15f-4994-9faa-67de8fb00284",
          title: 'Cornerstone event today! https://play.sorcerytcg.com/events/f385d0f4-c15f-4994-9faa-67de8fb00284',
          description: "",
          section: "News",},{id: "news-corner-stone-event-in-sidney-oh-december-7th-https-play-sorcerytcg-com-events-7aa66b1c-d638-4f0e-8413-5d4c44481954",
          title: 'Corner stone event In Sidney, OH December 7th!! https://play.sorcerytcg.com/events/7aa66b1c-d638-4f0e-8413-5d4c44481954',
          description: "",
          section: "News",},{id: "news-learn-to-play-event-oct-14th-6-https-play-sorcerytcg-com-events-60b80c51-2f31-4940-93a4-af65ac48ad3f",
          title: 'Learn to play event, Oct 14th @ 6  https://play.sorcerytcg.com/events/60b80c51-2f31-4940-93a4-af65ac48ad3f',
          description: "",
          section: "News",},{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
