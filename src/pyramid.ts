import { Heap } from "./heap"

import { readFileSync } from "fs"


interface Node {
  weight: number
  totalDistance: number
  depth: number
  index: number
  path: Array<"l" | "r">
}

const WIDTH = 2
const SPACING = WIDTH % 2 || 2
const rawPyramid = readFileSync("pyramids/pyramid3.txt", "utf8")
const pyramid = rawPyramid.split("\n").map(row => row.split(" ").map(value => Number(value)))
const averageValue = pyramid.flat().reduce((total, node) => total + node, 0) / pyramid.flat().length
console.info("Average value:", averageValue)


console.info(JSON.stringify(solvePyramid(pyramid)))


function solvePyramid(pyramid: number[][]): Node {
  const startTime = Date.now()

  const pyramidNodes: Node[][] = pyramid.map((layer, depth) => layer.map((node, index) => ({
    weight: Infinity,
    totalDistance: Infinity,
    depth,
    index,
    path: []
  })))

  pyramidNodes[0][0].totalDistance = pyramid[0][0]
  const unvisited: Heap<Node> = new Heap<Node>(
    (a, b) => a.weight < b.weight,
    (a, b) => a.depth === b.depth && a.index === b.index
  )
  unvisited.add(pyramidNodes[0][0])

  while (unvisited.length) {
    const currentNode = unvisited.get()

    if (currentNode.depth === pyramid.length - 1) {
      console.info("Took", Date.now() - startTime, "ms")
      return currentNode
    }

    const newDepth = currentNode.depth + 1

    const leftIndex = currentNode.index
    const leftDistance = currentNode.totalDistance + pyramid[newDepth][leftIndex]
    if (pyramidNodes[newDepth][leftIndex].totalDistance > leftDistance) {
      pyramidNodes[newDepth][leftIndex].totalDistance = leftDistance
      pyramidNodes[newDepth][leftIndex].weight = leftDistance - averageValue * newDepth / 2
      pyramidNodes[newDepth][leftIndex].path = currentNode.path.concat("l")
      unvisited.add(pyramidNodes[newDepth][leftIndex])
    }

    const rightIndex = currentNode.index + 1
    const rightDistance = currentNode.totalDistance + pyramid[newDepth][rightIndex]
    if (pyramidNodes[newDepth][rightIndex].totalDistance > rightDistance) {
      pyramidNodes[newDepth][rightIndex].totalDistance = rightDistance
      pyramidNodes[newDepth][rightIndex].weight = rightDistance - averageValue * newDepth / 2
      pyramidNodes[newDepth][rightIndex].path = currentNode.path.concat("r")
      unvisited.add(pyramidNodes[newDepth][rightIndex])
    }
  }

  throw new Error("Couldn't make it to the bottom.")
}

function printPyramid(pyramidNodes: Node[][]) {
  const pyramidWidth = width(pyramidNodes.length)
  for (const layer of pyramidNodes) {
    if (!layer.some(node => node.totalDistance < Infinity)) {
      continue
    }
    const layerWidth = width(layer.length)
    const paddingSpaces = Math.ceil((pyramidWidth - layerWidth) / 2)
    let outString = new Array(paddingSpaces).fill(" ").join("")
    for (const node of layer) {
      if (node.totalDistance === Infinity) {
        outString += "".padEnd(WIDTH + SPACING)
      } else {
        outString += `${node.totalDistance.toString(10).padStart(WIDTH).padEnd(WIDTH + SPACING)}`
      }
    }
    console.info(outString)
  }
}

function width(numberOfEntries: number): number {
  return WIDTH * numberOfEntries + SPACING * (numberOfEntries - 1)
}
