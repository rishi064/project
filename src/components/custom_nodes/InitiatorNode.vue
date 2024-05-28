<script setup>
import {
  MarkerType,
  addEdge,
  useHandleConnections,
  useNodeId,
  useVueFlow,
} from "@vue-flow/core";

const { addEdges, getOutgoers, addNodes, removeEdges, updateNodePositions } =
  useVueFlow();

const props = defineProps(["position", "type"]);
const nodeId = useNodeId();

const sourceConnections = useHandleConnections({
  type: "source",
});

function addChildrenNode() {
  const outgoingEdge = sourceConnections.value[0].edgeId; // 0 coz only one outgoing edge no matter what
  const outgoerIds = getOutgoers(nodeId).map((node) => node.id);

  outgoerIds.includes("end")
    ? removeEdges(["end-edge"])
    : removeEdges([outgoingEdge]);

  const id1stChild = (Math.random() * 100).toFixed(2);

  addNodes({
    id: `node-${id1stChild}`,
    label: `node-${id1stChild}`,
    type: "child",
    position: { x: 290, y: 250 },
  });

  const edgeId = (Math.random() * 100).toFixed(3);

  addEdges([
    {
      id: `edge-${edgeId}`,
      type: "straight",
      label: `edge-${edgeId}`,
      source: "initiator",
      target: `node-${id1stChild}`,
      style: { strokeWidth: 2 },
      animated: true,
      markerEnd: MarkerType.ArrowClosed,
    },
  ]);

  //won't get over-written incase the outgoer isn't end-edge
  addEdges([
    {
      id: `end-edge`,
      label: "end-edge",
      type: "straight",
      source: `node-${id1stChild}`,
      target: "end",
      style: { strokeWidth: 2 },
      markerEnd: MarkerType.ArrowClosed,
    },
  ]);

  if (!outgoerIds.includes("end")) {
    const edgeId = (Math.random() * 100).toFixed(3);

    addEdges([
      {
        id: `edge-${edgeId}`,
        label: `edge-${edgeId}`,
        type: "straight",
        source: `node-${id1stChild}`,
        target: `${outgoerIds[0]}`, //0 coz only one outgoer no matter what
        markerEnd: MarkerType.ArrowClosed,
        animated: true,
      },
    ]);

    //Logic of redrawing every child[Outgoing] node
    let goerIds = getOutgoers(nodeId).map((node) => node.id);
    console.log(goerIds, "outgoer");

    while (!goerIds.includes("end")) {
      const tempNodes = getOutgoers(goerIds[0]);
      console.log(tempNodes);

      tempNodes.map((tempNode) => {
        //redrawing of nodes(not edges) coz edges will arrange w.r.t. nodes
        addNodes({
          id: tempNode.id,
          label: tempNode.id === "end" ? "Stop" : tempNode.id,
          type: tempNode.id === "end" ? "output" : "child",
          position: { x: tempNode.position.x, y: tempNode.position.y + 250 },
        });

        goerIds[0] = tempNode.id;
      });
    }
  }
}
</script>

<template>
  <div class="initiator-node">
    <h2>Initiator</h2>
    <div class="btns">
      <button class="single-node" @click="addChildrenNode">+</button>
    </div>
  </div>
</template>

<style scoped>
.initiator-node h2 {
  font-size: 12px;
  font-weight: 700;
}

.initiator-node {
  background-color: aqua;
  padding: 0 20px;
  border-radius: 20px;
  border: 2px solid rgb(255, 0, 0);
}

.btns {
  display: flex;
  align-items: center;
  justify-content: center;
}

.single-node {
  position: absolute;
  border-radius: 5px;
  border: none;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  font-weight: bold;
}
</style>
