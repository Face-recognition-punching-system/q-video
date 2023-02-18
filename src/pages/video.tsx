/*
 * @Author       : Pear107
 * @Date         : 2023-02-12 00:20:19
 * @LastEditors  : Pear107
 * @LastEditTime : 2023-02-18 08:33:36
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
// import Webcam from "react-webcam"
// import TRTC, { Client, LocalStream } from "trtc-js-sdk"
// import { Peer } from "peerjs"

import Seo from "../components/seo"
import * as styles from "../styles/pages/video.module.less"
// import { SDKAppID } from "../config"
// import { axiosPost } from "../utils/axios"

let timer: any
let faceCascade: CascadeClassifier

const Video = () => {
  const [messageApi, contextHolder] = message.useMessage()
  const [isConn, setIsConn] = React.useState<Boolean>(false)
  const canvasRef = React.useRef<null | HTMLCanvasElement>(null)
  const websocketRef = React.useRef<null | WebSocket>(null)
  const videoRef = React.useRef<null | HTMLVideoElement>(null)
  const captureRef = React.useRef<null | VideoCapture>(null)
  const trackRef = React.useRef<null | MediaStreamTrack>(null)
  // const localStreamRef = React.useRef<LocalStream>(
  //   TRTC.createStream({
  //     userId: "web",
  //     audio: false,
  //     video: true,
  //   })
  // )
  // const localClientRef = React.useRef<Client | null>(null)
  // const remoteClientRef = React.useRef<any>(null)
  // const handleConnect = async (event: React.MouseEvent) => {
  //   event.preventDefault()
  //   console.log("handleConnect")
  //   setIsConn(true)
  //   try {
  //     const { userSig } = await axiosPost({
  //       url: "/sig",
  //       data: {
  //         SDKAppID: SDKAppID,
  //         userId: "web",
  //       },
  //     })
  //     console.log(userSig)
  //     if (userSig === undefined) {
  //       throw { message_: "e" }
  //     }
  //     console.log(userSig)
  //     messageApi.open({
  //       type: "success",
  //       content: `Client [web] created`,
  //     })
  //     localClientRef.current = TRTC.createClient({
  //       mode: "rtc",
  //       sdkAppId: parseInt(SDKAppID, 10),
  //       userId,
  //       userSig,
  //     })
  //     await localClientRef.current.join({ roomId: 4294967294 })
  //     messageApi.open({
  //       type: "success",
  //       content: `Join room [facereco] success`,
  //     })
  //   } catch (error: any) {
  //     messageApi.open({
  //       type: "error",
  //       content: `Join room facereco failed, please check your params. Error: ${error.message_}`,
  //     })
  //     setIsConn(false)
  //     return
  //   }

  //   try {
  //     await localStreamRef.current.initialize()
  //     messageApi.open({
  //       type: "success",
  //       content: `LocalStream [web] initialized`,
  //     })
  //     try {
  //       await localClientRef.current.publish(localStreamRef.current);
  //       console.log('本地流发布成功');
  //     } catch (error) {
  //       console.error('本地流发布失败 ' + error);
  //     }
  //     localStreamRef.current
  //       .play("local")
  //       .then(() => {
  //         messageApi.open({
  //           type: "success",
  //           content: `LocalStream [web] playing`,
  //         })
  //       })
  //       .catch((error: any) => {
  //         console.log(
  //           `LocalStream [web] failed to play. Error: ${error.message_}`
  //         )
  //         messageApi.open({
  //           type: "error",
  //           content: `LocalStream [web] failed to play. Error: ${error.message_}`,
  //         })
  //         if (localClientRef.current) {
  //           localClientRef.current.leave()
  //         }
  //         localStreamRef.current.stop()
  //         localStreamRef.current.close()
  //         return
  //       })
  //   } catch (error: any) {
  //     messageApi.open({
  //       type: "success",
  //       content: `LocalStream failed to initialize. Error: ${error.message_}`,
  //     })
  //     localClientRef.current.leave()
  //     localStreamRef.current.stop()
  //     localStreamRef.current.close()
  //     setIsConn(false)
  //     return
  //   }
  // }

  const handleExit = (event: React.MouseEvent) => {
    event.preventDefault()
    setIsConn(false)
    clearTimeout(timer)
    navigate(-1)
  }

  const handleConnect = async (event: React.MouseEvent) => {
    // event.preventDefault()
    // try {
    //   localRef.current = new RTCPeerConnection({
    //     iceServers: [
    //       { urls: "stun:stun.l.google.com:19302" },
    //       {
    //         urls: "stun::3478?transport=udp",
    //       },
    //     ],
    //   })
    //   remoteRef.current = new RTCPeerConnection({})
    //   streamRef.current = await navigator.mediaDevices.getUserMedia({
    //     video: { facingMode: "user" }, //调用前置摄像头，后置摄像头使用video: { facingMode: { exact: "environment" } }
    //   })
    //   localRef.current.addTrack(
    //     streamRef.current.getTracks()[0],
    //     streamRef.current
    //   )
    //   localRef.current.onicecandidate = async (e: RTCPeerConnectionIceEvent) => {
    //     if (remoteRef.current && e.candidate) {
    //       await remoteRef.current.addIceCandidate(e.candidate)
    //     }
    //   }
    //   localRef.current.oniceconnectionstatechange = (e: Event) => {
    //     console.log("remoteRef: iceconnectionstatechange", e)
    //   }
    //   localRef.current.onicecandidateerror = (ev:Event) =>{
    //     console.log(ev.type)
    //   }
    //   remoteRef.current.onicecandidate = async (e: RTCPeerConnectionIceEvent) => {
    //     if (localRef.current && e.candidate) {
    //       await localRef.current.addIceCandidate(e.candidate)
    //     }
    //   }
    //   remoteRef.current.oniceconnectionstatechange = (ev: Event) => {
    //     console.log("remoteRef: iceconnectionstatechange", ev)
    //   }
    //   remoteRef.current.onicecandidateerror = (ev: Event) =>{
    //     console.log(ev.type)
    //   }
    //   remoteRef.current.ontrack = (ev: RTCTrackEvent) => {
    //     if (videoRef.current && ev.streams.length > 0) {
    //       videoRef.current.srcObject = ev.streams[0]
    //     }
    //   }
    //   const offer = await localRef.current.createOffer()
    //   localRef.current.setLocalDescription(offer)
    //   pullStream(offer)
    //   setIsConn(true)
    // } catch (e) {
    //   console.log(e)
    // }
    // try {
    //   websocketRef.current = new WebSocket("ws://localhost:9980")
    //   websocketRef.current.onopen = async (ev: Event) => {
    //     messageApi.success("connect success")
    //     getMedia()
    //     nextTick()
    //     setIsConn(true)
    //   }

    //   websocketRef.current.onmessage = async (ev: MessageEvent<Blob>) => {
    //     console.log(ev.data)
    //     if (canvasRef.current) {
    //     }
    //   }

    //   websocketRef.current.onerror = (ev: Event) => {
    //     messageApi.error("connect error")
    //     websocketRef.current?.close()
    //     if (trackRef.current) {
    //       trackRef.current.stop()
    //     }

    //     clearTimeout(timer)
    //     setIsConn(false)
    //   }

    //   websocketRef.current.onclose = (ev: CloseEvent) => {
    //     messageApi.info("connect close")
    //     websocketRef.current?.close()
    //     if (trackRef.current) {
    //       trackRef.current.stop()
    //     }

    //     clearTimeout(timer)
    //     setIsConn(false)
    //   }
    // } catch (e: any) {
    //   console.log(e)
    //   websocketRef.current?.close()
    //   if (trackRef.current) {
    //     trackRef.current.stop()
    //   }

    //   clearTimeout(timer)
    //   setIsConn(false)
    // }
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

      let mat: Mat = new cv.Mat(480, 640, cv.CV_8UC4)
      captureRef.current.read(mat)
      let gray: Mat = new Mat()
      cv.cvtColor(mat, gray, cv.COLOR_RGBA2GRAY, 0)
      const faces: RectVector = new cv.RectVector()
      const msize = new cv.Size(0, 0)
      faceCascade.detectMultiScale(gray, faces, 1.1, 3, 0, msize, msize)
      for (let i = 0; i < 1; ++i) {
        const point1 = new cv.Point(faces.get(i).x, faces.get(i).y)
        const point2 = new cv.Point(
          faces.get(i).x + faces.get(i).width,
          faces.get(i).y + faces.get(i).height
        )
        cv.rectangle(mat, point1, point2, [255, 0, 0, 255])
      }
      cv.imshow(canvasRef.current, mat)
      mat.delete()
      faces.delete()
      gray.delete()
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
    // see https://docs.opencv.org/master/utils.js
    const response = await fetch(url)
    const buffer = await response.arrayBuffer()
    const data = new Uint8Array(buffer)
    cv.FS_createDataFile("/", cvFilePath, data, true, false, false)
  }

  const blobToDataUrl = (blob: Blob): Promise<string | ArrayBuffer> => {
    return new Promise((resolve, reject) => {
      const a = new FileReader()
      a.readAsDataURL(blob)
      a.onload = (ev: ProgressEvent<FileReader>) => {
        if (ev.target && ev.target.result) {
          resolve(ev.target.result)
        } else {
          reject("")
        }
      }
    })
  }

  const dataUrlToCanvas = (url: string) => {
    console.log(url)
    var img = new Image()
    img.onload = function () {}
    img.onerror = () => {}
    img.src = url
  }

  // async function pushStream(answer: RTCSessionDescriptionInit) {
  //   if (localRef.current) {
  //     localRef.current.setRemoteDescription(answer)
  //   }
  // }

  // async function pullStream(offer: RTCSessionDescriptionInit): Promise<void> {
  //   if (remoteRef.current) {
  //     remoteRef.current.setRemoteDescription(offer)
  //     const answer = await remoteRef.current.createAnswer()
  //     remoteRef.current.setLocalDescription(answer)
  //     pushStream(answer)
  //   }
  // }

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
