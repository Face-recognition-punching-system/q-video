/*
 * @Author       : Pear107
 * @Date         : 2023-02-11 23:32:17
 * @LastEditors  : Pear107
 * @LastEditTime : 2023-02-12 00:01:16
 * @FilePath     : \q-video\src\pages\404.tsx
 * @Description  : 头部注释
 */
import * as React from "react"

import Seo from "../components/seo"

const NotFoundPage = () => (
  <div>
    <h1>404: Not Found</h1>
    <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
  </div>
)

export const Head = () => <Seo title="404: Not Found" />

export default NotFoundPage
