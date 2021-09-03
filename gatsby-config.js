/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */

module.exports = {
  /* Your site config here */
  siteMetadata: {
    title: `John Paul Mulongo`,
    author: `John Paul Mulongo`,
    firstName: `John`,
    lastName: `Mulongo`,
    description: `John Paul's personal site`,
    occupation: `Software Engineer`,
    keywords: [`John`, `Mulongo`, `Personal`, `Blog`, `Projects`, `Work`],
    siteUrl:
      process.env.URL || process.env.DEPLOY_URL || `http://localhost:8000`,
    unemployed: false,
    designations: [`Coding Monkey`, `Jedi Master`],
    readingList: [
      {
        title: `Straight and Crooked Thinking`,
        author: `Robert H. Thouless`,
        link: `https://www.goodreads.com/book/show/11577463-straight-and-crooked-thinking`,
      },
      {
        title: `The Art of Insight in Science and Engineering: Mastering Complexity`,
        author: `Sanjoy Mahan`,
        link: `https://www.goodreads.com/book/show/22050657-the-art-of-insight-in-science-and-engineering`,
      },
      {
        title: `The Art of Doing Science and Engineering`,
        author: `Richard Hamming`,
        link: `https://www.goodreads.com/book/show/530415.The_Art_of_Doing_Science_and_Engineering`,
      },
    ],
    showsList: [
      {
        title: `Boston Legal`,
        author: `David E. Kelley`,
        link: `https://www.imdb.com/title/tt0402711/`,
      },
      {
        title: `Love, Death & Robots`,
        author: `Tim Miller`,
        link: `https://www.imdb.com/title/tt9561862/`,
      },
      {
        title: `True Detective`,
        author: `Nic Pizzolatto`,
        link: `https://www.imdb.com/title/tt2356777/`,
      },
    ],
  },
  plugins: [
    `gatsby-plugin-preload-link-crossorigin`,
    `gatsby-plugin-catch-links`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: "src",
        path: `${__dirname}/src/`,
      },
    },
    `gatsby-plugin-sass`,
    `gatsby-transformer-remark`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `John Doe's Personal Site`,
        short_name: `J.Doe`,
        description: `This is my personal site.`,
        start_url: `/`,
        background_color: `#fff`,
        theme_color: `#fff`,
        display: `standalone`,
        icon: `${__dirname}/static/favicon.ico`, // This path is relative to the root of the site.
      },
    },
    `gatsby-plugin-offline`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: "gatsby-plugin-google-fonts",
      options: {
        fonts: ["Raleway:300,400"],
        display: "swap",
      },
    },
    {
      resolve: `gatsby-plugin-nprogress`,
      options: {
        color: `tomato`,
        showSpinner: true,
      },
    },
  ],
}
