<script setup>
import {
  useVueFlow,
  useNodeId,
  useHandleConnections,
  MarkerType,
} from "@vue-flow/core";
import { inject, onMounted, ref } from "vue";

const {
  getNodes,
  getEdges,
  addNodes,
  addEdges,
  removeEdges,
  toObject,
  setViewport,
  getOutgoers,
} = useVueFlow();

const props = defineProps(["data", "label", "position"]);

const endNode = getNodes.value.filter((node) => node.id === "end");
const endNodeYPosition = endNode[0].position.y;
const endNodeXPosition = endNode[0].position.x;

const shouldMoveEndNode = ref(false);

if (endNodeYPosition - props.position.y < 100) {
  shouldMoveEndNode.value = true;
}

const nodeId = useNodeId();

const outgoingEdgesOfClickedNode = useHandleConnections({
  type: "source",
  nodeId,
});

const incomingedgetoLastNode = useHandleConnections({
  type: "target",
  nodeId: "end",
});

function adjustViewPort() {
  setViewport({
    x: -(endNodeXPosition - 400),
    y: -(endNodeYPosition - 700),
    zoom: 1,
  });
}

function addChildrenNode() {
  // console.log("clicked node's id", nodeId);

  const outgoerIds = getOutgoers(nodeId).map((node) => node.id);

  // console.log(`target of clicked node-${nodeId} before click =>`, outgoerIds);

  // console.log("outgoing edges", outgoingEdgesOfClickedNode.value);

  // specifically scope to the event
  const outgoingEdgesId = outgoingEdgesOfClickedNode.value.map(
    (edge) => edge.edgeId
  );

  if (outgoerIds.includes("end")) {
    // 1.remove end edge :
    removeEdges([...outgoingEdgesId]);

    shouldMoveEndNode.value &&
      addNodes({
        id: "end",
        type: "output",
        label: "Stop",
        position: { x: 400, y: endNodeYPosition + 100 },
      });

    //2 add new children node:
    const nodeIdForNewNode = (Math.random() * 1000).toFixed(2);
    addNodes({
      id: `node-${nodeIdForNewNode}`,
      label: `node-${nodeIdForNewNode}`,
      type: "child",
      position: { x: props.position.x, y: props.position.y + 100 },
    });

    //3.1 add edge connecting new node and current node
    //3.2 add edge connecting new node and end node
    const edgeIdForNewEdge = (Math.random() * 1000).toFixed(3);
    addEdges([
      {
        id: `edge-${edgeIdForNewEdge}`,
        label: `edge-${edgeIdForNewEdge}`,
        type: "straight",
        source: nodeId,
        target: `node-${nodeIdForNewNode}`,
        animated: true,
        markerEnd: MarkerType.ArrowClosed,
      },
      {
        id: `end-edge`,
        label: "end-edge",
        type: "straight",
        source: `node-${nodeIdForNewNode}`,
        target: "end",
        animated: true,
        markerEnd: MarkerType.ArrowClosed,
      },
    ]);
  } else {
    // console.log("else section ko", outgoerIds);

    //1. add child node:
    const nodeIdForNewNode = (Math.random() * 1000).toFixed(2);
    addNodes({
      id: `node-${nodeIdForNewNode}`,
      label: `node-${nodeIdForNewNode}`,
      type: "child",
      position: { x: props.position.x - 250, y: props.position.y + 50 },
    });

    //3. connect current node and the child node:
    const edgeIdForNewEdge1 = (Math.random() * 1000).toFixed(3);
    addEdges([
      {
        id: `edge-${edgeIdForNewEdge1}`,
        label: `edge-${edgeIdForNewEdge1}`,
        source: nodeId,
        target: `node-${nodeIdForNewNode}`,
        animated: true,
        markerEnd: MarkerType.ArrowClosed,
        style: { strokeWidth: 2 },
      },
    ]);

    if (!outgoerIds.includes("end")) {
      outgoerIds.forEach((value) => {
        const newEdge = (Math.random() * 1000).toFixed(5);

        addEdges({
          id: `edge-${newEdge}`,
          label: `edge-${newEdge}`,
          type: "default",
          source: `node-${nodeIdForNewNode}`,
          target: value,
          animated: true,
          markerEnd: MarkerType.ArrowClosed,
        });
      });
    }

    // console.log("else ko ", outgoingEdgesId);
    // 4. Remove the previous outgoing edge
    removeEdges([...outgoingEdgesId]);

    // 5. Align every upcoming once the new middle node is added
  }
}

function add2ChildrenNode() {
  // specifically scope to the event
  // console.log(outgoingEdgesOfClickedNode.value);
  const outgoingEdgesOfClickedNodeIds = outgoingEdgesOfClickedNode.value.map(
    (edge) => edge.edgeId
  );

  // console.log(
  //   "connected edge id of clicked node",
  //   outgoingEdgesOfClickedNodeIds
  // );

  // console.log(
  //   "incoming edges to last node before click",
  //   incomingedgetoLastNode.value
  // );

  // console.log("outgoers of [before click]", nodeId, getOutgoers(nodeId));

  const outgoerIds = getOutgoers(nodeId).map((element) => element.id);

  if (outgoerIds.length < 2) {
    outgoerIds.includes("end")
      ? removeEdges(["end-edge"])
      : removeEdges([...outgoingEdgesOfClickedNodeIds]);

    const nodeIdForNewChildNode1 = (Math.random() * 1000).toFixed(3);
    const nodeIdForNewChildNode2 = (Math.random() * 1000).toFixed(3);
    const nodeIdForNewHandleNode = (Math.random() * 1000).toFixed(3);

    addNodes([
      {
        id: `node-${nodeIdForNewChildNode1}`,
        label: `node-${nodeIdForNewChildNode1}`,
        type: "child",
        position: { x: props.position.x + 180, y: props.position.y + 100 },
      },
      {
        id: `node-${nodeIdForNewChildNode2}`,
        label: `node-${nodeIdForNewChildNode2}`,
        type: "child",
        position: { x: props.position.x - 200, y: props.position.y + 100 },
      },
      {
        id: `handle-${nodeIdForNewHandleNode}`,
        label: ``,
        type: "child",
        position: { x: props.position.x, y: props.position.y + 200 },
      },
    ]);

    const edgeIdForNewEdge1 = (Math.random() * 1000).toFixed(4);
    const edgeIdForNewEdge2 = (Math.random() * 1000).toFixed(4);

    const edgeIdForNewEndEdge1 = (Math.random() * 1000).toFixed(5);
    const edgeIdForNewEndEdge2 = (Math.random() * 1000).toFixed(5);

    addEdges([
      //first childnode to current node
      {
        id: `edge-${edgeIdForNewEdge1}`,
        label: `edge-${edgeIdForNewEdge1}`,
        type: "default",
        source: nodeId,
        target: `node-${nodeIdForNewChildNode1}`,
        animated: true,
        markerEnd: MarkerType.ArrowClosed,
      },
      //second childnode to current node
      {
        id: `edge-${edgeIdForNewEdge2}`,
        label: `edge-${edgeIdForNewEdge2}`,
        type: "default",
        source: nodeId,
        target: `node-${nodeIdForNewChildNode2}`,
        animated: true,
        markerEnd: MarkerType.ArrowClosed,
      },
      //first childnode to handle node
      {
        id: `handle-edge-${edgeIdForNewEndEdge1}`,
        label: `handle-edge-${edgeIdForNewEndEdge1}`,
        type: "default",
        source: `node-${nodeIdForNewChildNode1}`,
        target: `handle-${nodeIdForNewHandleNode}`,
        animated: true,
        markerEnd: MarkerType.ArrowClosed,
      },
      //second childnode to handle node
      {
        id: `handle-edge-${edgeIdForNewEndEdge2}`,
        label: `handle-edge-${edgeIdForNewEndEdge2}`,
        type: "default",
        source: `node-${nodeIdForNewChildNode2}`,
        target: `handle-${nodeIdForNewHandleNode}`,
        animated: true,
        markerEnd: MarkerType.ArrowClosed,
      },
      //handlenode to end node. addEdge isn't over-written so no need to worry about removing it if the node clicked isn't parent of end edge
      {
        id: "end-edge",
        label: `end-edge`,
        type: "straight",
        source: `handle-${nodeIdForNewHandleNode}`,
        target: "end",
        animated: true,
        markerEnd: MarkerType.ArrowClosed,
      },
    ]);

    // console.log(outgoerIds, outgoerIds.includes("end"));

    if (!outgoerIds.includes("end")) {
      outgoerIds.forEach((value) => {
        const newEdgeHandle = (Math.random() * 1000).toFixed(5);

        addEdges({
          id: `edge-${newEdgeHandle}`,
          label: `edge-${newEdgeHandle}`,
          type: "default",
          source: `handle-${nodeIdForNewHandleNode}`,
          target: value,
          animated: true,
          markerEnd: MarkerType.ArrowClosed,
        });
      });
    }
  } else {
    console.log("multiple outgoers po xan ta");
    console.log("clicked node", nodeId);

    const newNode = (Math.random() * 1000).toFixed(4);

    addNodes({
      id: `node-${newNode}`,
      label: `node-${newNode}`,
      type: "child",
      position: { x: props.position.x + 180, y: props.position.y + 100 },
    });

    const edgeNewtoCur = (Math.random() * 10000).toFixed(2);
    const curToHandle = (Math.random() * 10000).toFixed(2);

    const targetHandleid = getOutgoers(getOutgoers(nodeId)[0].id)[0].id;
    addEdges([
      {
        id: `edge-${edgeNewtoCur}`,
        label: `edge-${edgeNewtoCur}`,
        type: "default",
        source: nodeId,
        target: `node-${newNode}`,
        animated: true,
        markerEnd: MarkerType.ArrowClosed,
      },
      {
        id: `edge-${curToHandle}`,
        label: `edge-${curToHandle}`,
        type: "default",
        source: `node-${newNode}`,
        target: targetHandleid,
        animated: true,
        markerEnd: MarkerType.ArrowClosed,
      },
    ]);
  }
}
adjustViewPort();
</script>

<template>
  <div class="child-node">
    <h2>{{ props.label }}</h2>
    <div class="btns">
      <button class="btn-add btn-add-children-node" @click="addChildrenNode">
        +
      </button>
      <button class="btn-add btn-add-sibling-node" @click="add2ChildrenNode">
        2
      </button>
    </div>
  </div>
</template>

<style scoped>
.child-node {
  background-color: orange;
  padding: 0 20px;
  border-radius: 20px;
  border: 2px solid blue;
}

.child-node h2 {
  font-size: 20px;
  font-weight: 600;
}

.btns {
  display: flex;
  gap: 4px;

  left: 50%;
  position: absolute;
  transform: translate(-50%, -50%);
}

.btn-add {
  border-radius: 5px;
  border: none;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  font-weight: bold;
}
</style>
