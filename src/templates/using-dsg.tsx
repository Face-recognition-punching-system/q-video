/*
 * @Author       : Pear107
 * @Date         : 2023-02-11 23:32:17
 * @LastEditors  : Pear107
 * @LastEditTime : 2023-02-12 01:04:18
 * @FilePath     : \q-video\src\templates\using-dsg.tsx
 * @Description  : 头部注释
 */
import * as React from "react"
import { Link } from "gatsby"

import Seo from "../components/seo"

const UsingDSG = () => (
  <div>
    <h1>
      Hello from a <b>DSG Page</b>
    </h1>
    <p>This page is not created until requested by a user.</p>
    <p>
      To learn more, head over to our{" "}
      <a href="https://www.gatsbyjs.com/docs/reference/rendering-options/deferred-static-generation/">
        documentation about Deferred Static Generation
      </a>
      .
    </p>
    <Link to="/">Go back to the homepage</Link>
  </div>
)

export const Head = () => <Seo title="Using DSG" />

export default UsingDSG
