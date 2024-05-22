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
    y: -(endNodeYPosition - 400),
    zoom: 1,
  });
}

function addChildrenNode() {
  console.log("clicked node's id", nodeId);
  console.log(
    `target of clicked node-${nodeId} before click =>`,
    getOutgoers(nodeId)[0].id === "end"
  );

  // specifically scope to the event
  const idOutgoingEdgesOfClickedNode =
    outgoingEdgesOfClickedNode.value[0]?.edgeId;

  if (getOutgoers(nodeId)[0].id === "end") {
    // 1.remove end edge :
    removeEdges([idOutgoingEdgesOfClickedNode]);

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
    console.log(
      "id of outgoing edge of clicked node",
      idOutgoingEdgesOfClickedNode
    );

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
    const edgeIdForNewEdge2 = (Math.random() * 1000).toFixed(3);
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
      {
        id: `edge-${edgeIdForNewEdge2}`,
        label: `edge-${edgeIdForNewEdge2}`,
        source: `node-${nodeIdForNewNode}`,
        target: getOutgoers(nodeId)[0].id,
        animated: true,
        markerEnd: MarkerType.ArrowClosed,
      },
    ]);

    // 4. Remove the previous outgoing edge
    removeEdges([idOutgoingEdgesOfClickedNode]);

    // 5. Align every upcoming once the new middle node is added
  }

  // data to update to database at last on each children added
  // console.log("whole vueflow component's info:", toObject());
  // console.log("all nodes", getNodes.value);
  // console.log("all edges", getEdges.value);

  //commented temporarily
  // adjustViewPort();
}

function add2ChildrenNode() {
  // specifically scope to the event
  const idOutgoingEdgesOfClickedNode =
    outgoingEdgesOfClickedNode.value[0]?.edgeId;

  console.log(
    "connected edge id of clicked node",
    idOutgoingEdgesOfClickedNode
  );

  console.log(
    "incoming edges to last node before click",
    incomingedgetoLastNode.value
  );

  if (getOutgoers(nodeId)[0].id === "end") {
    removeEdges(["end-edge", idOutgoingEdgesOfClickedNode]);

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
        label: `handle-${nodeIdForNewHandleNode}`,
        type: "child",
        position: { x: props.position.x - 100, y: props.position.y + 200 },
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
        type: "smoothstep",
        source: `node-${nodeIdForNewChildNode1}`,
        target: `handle-${nodeIdForNewHandleNode}`,
        animated: true,
        markerEnd: MarkerType.ArrowClosed,
      },
      //second childnode to handle node
      {
        id: `handle-edge-${edgeIdForNewEndEdge2}`,
        label: `handle-edge-${edgeIdForNewEndEdge2}`,
        type: "straight",
        source: `node-${nodeIdForNewChildNode2}`,
        target: `handle-${nodeIdForNewHandleNode}`,
        animated: true,
        markerEnd: MarkerType.ArrowClosed,
      },
      //handlenode to end node
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
  } else {
    console.log(
      "connected edges of clicked node",
      outgoingEdgesOfClickedNode.value
    );

    console.log(
      "clicked node ko child node[multiple ma]",
      nodeId,
      getOutgoers(nodeId)
    );

    // 1. remove outgoing edges:

    // 2. add the nodes
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
        label: `handle-${nodeIdForNewHandleNode}`,
        type: "child",
        position: { x: props.position.x - 100, y: props.position.y + 200 },
      },
    ]);
  }

  //edge add garda samasya
  // commented temporarily:
  // adjustViewPort();
}
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
