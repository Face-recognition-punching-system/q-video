/*
 * @Author       : Pear107
 * @Date         : 2023-02-11 23:32:17
 * @LastEditors  : Pear107
 * @LastEditTime : 2023-02-12 01:06:02
 * @FilePath     : \q-video\src\pages\index.tsx
 * @Description  : 头部注释
 */
import { Button } from "antd"
import * as React from "react"
import { navigate } from "gatsby"

import Seo from "../components/seo"

const Index = () => {
  const handleEnter = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()
    navigate("/video")
  }

  return (
    <div className="custom_container">
      <Button className="button" onClick={handleEnter} type="primary">
        进入监控页
      </Button>
    </div>
  )
}

export const Head = () => <Seo title="Home" />

export default Index
