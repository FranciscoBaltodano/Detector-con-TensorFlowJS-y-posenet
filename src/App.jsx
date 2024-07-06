import { useRef } from 'react'
import * as tf from '@tensorflow/tfjs'
import * as posenet from '@tensorflow-models/posenet'
import Webcam from 'react-webcam'
import { drawKeypoints, drawSkeleton } from './utilities'

function App() {

  // Referencia a la webcam y al canvas
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  // Cargar el modelo de posenet
  const runPosenet = async () => {

    // Cargar el modelo de posenet con las siguientes configuraciones
    const net = await posenet.load({
      inputResolution: { width: 640, height: 480 },
      scale: 0.5,
    })

    // Detectar la pose en tiempo real cada 100 mili segundos
    setInterval(() => {
      detect(net)
    }, 100)
  }

  // Detectar la pose en tiempo real
  const detect = async (net) => {
    // Verificar si la webcam está disponible y lista para usarse
    if (
      typeof webcamRef.current !== 'undefined' &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Obtener propiedades del video
      const video = webcamRef.current.video
      const videoWidth = webcamRef.current.video.videoWidth
      const videoHeight = webcamRef.current.video.videoHeight

      // Setear el tamaño del video
      webcamRef.current.video.width = videoWidth
      webcamRef.current.video.height = videoHeight

      // Hacer estimaciones
      const pose = await net.estimateSinglePose(video)
      // console.log(pose)

      // Dibujar en el canvas
      drawCanvas(pose, video, videoWidth, videoHeight, canvasRef)
    }
  }

  // Dibujar en el canvas
  const drawCanvas = (pose, video, videoWidth, videoHeight, canvas) => {
    // Obtener el contexto del canvas para dibujar en él 
    const ctx = canvas.current.getContext('2d')
    // Setear el tamaño del canvas para que sea igual al del video
    canvas.current.width = videoWidth
    canvas.current.height = videoHeight

    // Dibujar keypoints y skeleton en el canvas
    drawKeypoints(pose['keypoints'], 0.6, ctx)
    drawSkeleton(pose['keypoints'], 0.7, ctx)
  }

  // Llamar a la función runPosenet
  runPosenet();

  return (
    <>
      <Webcam
        ref={webcamRef}
        style={{ 
        position:'absolute',
        marginLeft: 'auto',
        marginRight: 'auto',
        left: 0,
        right: 0,
        textAlign: 'center',
        zindex: 0,
        width: 640,
        height: 480
      }} />

      <canvas 
        ref={canvasRef}
        style={{
        position:'absolute',
        marginLeft: 'auto',
        marginRight: 'auto',
        left: 0,
        right: 0,
        textAlign: 'center',
        zindex: 9,
        width: 640,
        height: 480
      }} />

    </>
  )
}

export default App
