/*
 * @Author       : Pear107
 * @Date         : 2023-02-12 00:20:19
 * @LastEditors  : Pear107
 * @LastEditTime : 2023-02-22 00:15:38
 * @FilePath     : \q-video\src\pages\video.tsx
 * @Description  : 头部注释
 */
import { Button, message } from "antd"
import * as React from "react"
import { navigate } from "gatsby"
import cv, {
  CascadeClassifier,
  Mat,
  RectVector,
  VideoCapture,
} from "@techstark/opencv-js"

import Seo from "../components/seo"
import * as styles from "../styles/pages/video.module.less"
import { axiosPost } from "../utils/axios"

let timer: any
let debounce: any
let faceCascade: CascadeClassifier

const Video = () => {
  const [isConn, setIsConn] = React.useState<Boolean>(false)
  const canvasRef = React.useRef<null | HTMLCanvasElement>(null)
  const videoRef = React.useRef<null | HTMLVideoElement>(null)
  const captureRef = React.useRef<null | VideoCapture>(null)
  const trackRef = React.useRef<null | MediaStreamTrack>(null)
  const [messageApi, contextHolder] = message.useMessage()
  const handleExit = (event: React.MouseEvent) => {
    event.preventDefault()
    setIsConn(false)
    clearTimeout(timer)
    navigate(-1)
  }

  const handleConnect = async (event: React.MouseEvent) => {
    event.preventDefault()
    faceCascade = new cv.CascadeClassifier()
    faceCascade.load("haarcascade_frontalface_default.xml")
    getMedia()
    nextTick()
    setIsConn(true)
  }

  const handleDisconnect = (event: React.MouseEvent) => {
    event.preventDefault()
    clearTimeout(timer)
    setIsConn(false)
    trackRef.current?.stop()
  }

  const detect = () => {
    try {
      if (!videoRef.current || !captureRef.current || !canvasRef.current) {
        return
      }

      const mat = new cv.Mat(480, 640, cv.CV_8UC4)
      const gray = mat.clone()
      const msize = new cv.Size(0, 0)
      captureRef.current.read(mat)
      cv.cvtColor(mat, gray, cv.COLOR_RGBA2GRAY, 0)
      const faces: RectVector = new cv.RectVector()
      faceCascade.detectMultiScale(gray, faces, 1.1, 3, 0, msize, msize)
      if (faces.size() > 1) {
        messageApi.open({ type: "error", content: "人数过多" })
      } else if (faces.size() === 1) {
        // for (let i = 0; i < faces.size(); ++i) {
        // const point1 = new cv.Point(faces.get(i).x, faces.get(i).y)
        // const point2 = new cv.Point(
        //   faces.get(i).x + faces.get(i).width,
        //   faces.get(i).y + faces.get(i).height
        // )
        // cv.rectangle(mat, point1, point2, [255, 0, 0, 255])
        // const face: Mat = gray.roi(faces.get(i))
        // cv.resize(face, face, size, 0, 0, cv.INTER_AREA)
        // }
        cv.imshow(canvasRef.current, mat)
        
        const base64 = canvasRef.current.toDataURL().replace(/^data:image\/\w+;base64,/, "")
        if (!debounce) {
          console.log(base64)
          debounce = setTimeout(() => {
            clearTimeout(debounce)
            debounce = null
          }, 2000)
        }
      } else {
        cv.imshow(canvasRef.current, mat)
      }

      faces.delete()
    } catch (error: any) {
      console.log(error)
    }
  }

  const nextTick = () => {
    let begin = Date.now()
    detect()
    let delay = 1000 / 30 - (Date.now() - begin)
    timer = setTimeout(async () => {
      nextTick()
    }, delay)
  }

  const getMedia = () => {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "user" } })
      .then((value: MediaStream) => {
        if (videoRef.current) {
          trackRef.current = value.getTracks()[0]
          videoRef.current.srcObject = value
        }
      })
  }

  const loadDataFile = async (cvFilePath: string, url: string) => {
    const response = await fetch(url)
    const buffer = await response.arrayBuffer()
    const data = new Uint8Array(buffer)
    cv.FS_createDataFile("/", cvFilePath, data, true, false, false)
  }

  React.useEffect(() => {
    loadDataFile(
      "/haarcascade_frontalface_default.xml",
      "/models/haarcascade_frontalface_default.xml"
    )

    if (videoRef.current) {
      captureRef.current = new cv.VideoCapture(videoRef.current)
    }

    return () => {
      clearTimeout(timer)
      setIsConn(false)
      trackRef.current?.stop()
      if (faceCascade) {
        faceCascade.delete()
      }
    }
  }, [])

  return (
    <>
      {contextHolder}
      <div className="custom_container">
        <Button
          className={`${styles.exit} button`}
          onClick={handleExit}
          danger
          type="primary"
        >
          退出
        </Button>
        {!isConn ? (
          <Button
            className={`${styles.connect} button`}
            onClick={handleConnect}
            type="primary"
          >
            连接
          </Button>
        ) : (
          <Button
            className={`${styles.disconnect} button`}
            onClick={handleDisconnect}
            danger
            type="primary"
          >
            断开
          </Button>
        )}
        <video ref={videoRef} width={640} height={480} autoPlay hidden></video>
        <canvas
          className={`${styles.canvas} bg-gray-900`}
          ref={canvasRef}
          width={640}
          height={480}
        ></canvas>
      </div>
    </>
  )
}

export const Head = () => <Seo title="Home" />

export default Video
