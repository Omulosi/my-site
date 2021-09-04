import React from "react"
import Container from "react-bootstrap/Container"
import { PageLayout, PageTitle } from "../components"

import SEO from "../utils/seo"

export default ({ title, excerpt, html, subTitle, isProject }) => (
  <PageLayout>
    <SEO title={title} description={excerpt} />
    <Container className="text-center" fluid>
      <PageTitle title={title} />
      {subTitle}
      <Container className={isProject ? "text-center" : "text-justify"}>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </Container>
    </Container>
  </PageLayout>
)
