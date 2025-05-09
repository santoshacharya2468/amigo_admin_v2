import { useEffect, useRef } from "react"
import { Player } from "svgaplayerweb"
import SVGA from "svgaplayerweb"

interface SVGAPlayerProps {
  src: string
  width?: number
  height?: number
  classname: string
}

const SVGAPlayer: React.FC<SVGAPlayerProps> = ({
  src,
  width = 200,
  height = 200,
  classname,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const player = new Player(canvasRef.current)
    const parser = new SVGA.Parser()

    parser.load(src, (videoItem) => {
      player.setVideoItem(videoItem)
      // Just render the first frame and stop
      player.stepToFrame(10, false)
    })

    return () => {
      player.clear()
    }
  }, [src])

  return <canvas className={classname} ref={canvasRef} width={width} height={height} />
}

export default SVGAPlayer
