import { generateRandomColor } from "./helpers/randomColor";
import { useVueFlow, MarkerType } from "@vue-flow/core";

export function useNodeAddition() {
  const { getNodes, addNodes, addEdges, removeEdges, getOutgoers } =
    useVueFlow();

  function updateEndNodePosition(newYPosition) {
    addNodes({
      id: "end",
      type: "output",
      label: "Stop",
      position: { x: 400, y: newYPosition },
    });
  }

  // 1.
  function addOneChild(nodeId, outgoingEdgesOfClickedNode, offset, props) {
    const outgoerIds = getOutgoers(nodeId).map((node) => node.id);
    console.log("outgoerIds", outgoerIds);
    const outgoingEdgesId = outgoingEdgesOfClickedNode.value.map(
      (edge) => edge.edgeId
    );

    const endNode = getNodes.value.find((node) => node.id === "end");
    const endNodeYPosition = endNode.position.y;

    if (outgoerIds.includes("end")) {
      removeEdges([...outgoingEdgesId]);

      offset.value = endNodeYPosition - props.position.y;

      if (offset.value < 251) {
        updateEndNodePosition(endNodeYPosition + 250);
      }

      const newChildNodeId = (Math.random() * 1000).toFixed(2);
      addNodes({
        id: `node-${newChildNodeId}`,
        label: `node-${newChildNodeId}`,
        type: "child",
        position: { x: props.position.x, y: props.position.y + 250 },
      });

      addEdges([
        {
          id: `edge-${(Math.random() * 1000).toFixed(3)}`,
          label: `edge-${(Math.random() * 1000).toFixed(3)}`,
          type: "straight",
          source: nodeId,
          target: `node-${newChildNodeId}`,
          animated: true,
          markerEnd: MarkerType.ArrowClosed,
          style: { stroke: generateRandomColor() },
        },
        {
          id: `end-edge`,
          label: "end-edge",
          type: "straight",
          source: `node-${newChildNodeId}`,
          target: "end",
          animated: true,
          markerEnd: MarkerType.ArrowClosed,
          style: { stroke: generateRandomColor() },
        },
      ]);
    } else {
      const newChildNodeId = (Math.random() * 1000).toFixed(2);
      console.log("newChildNodeId", newChildNodeId);
      console.log("outgoerIds", outgoerIds);
      addNodes({
        id: `node-${newChildNodeId}`,
        label: `node-${newChildNodeId}`,
        type: "child",
        position: { x: props.position.x, y: props.position.y + 250 },
      });

      addEdges([
        {
          id: `edge-${(Math.random() * 1000).toFixed(3)}`,
          label: `edge-${(Math.random() * 1000).toFixed(3)}`,
          source: nodeId,
          target: `node-${newChildNodeId}`,
          animated: true,
          markerEnd: MarkerType.ArrowClosed,
          style: { stroke: generateRandomColor() },
          style: { strokeWidth: 2 },
        },
      ]);

      if (!outgoerIds.includes("end")) {
        outgoerIds.forEach((value) => {
          console.log("value", value);
          addEdges({
            id: `edge-${(Math.random() * 1000).toFixed(5)}`,
            label: `edge-${(Math.random() * 1000).toFixed(5)}`,
            type: "default",
            source: `node-${newChildNodeId}`,
            target: value,
            animated: true,
            markerEnd: MarkerType.ArrowClosed,
            style: { stroke: generateRandomColor() },
          });
        });
      }

      removeEdges([...outgoingEdgesId]);

      let goerIds = getOutgoers(nodeId).map((node) => node.id);
      while (!goerIds.includes("end")) {
        const tempNodes = getOutgoers(goerIds[0]);
        tempNodes.forEach((tempNode) => {
          console.log("tempNode", tempNode);
          addNodes({
            id: tempNode.id,
            label: tempNode.label,
            type: tempNode.type,
            position: { x: tempNode.position.x, y: tempNode.position.y + 250 },
          });
          goerIds[0] = tempNode.id;
        });
      }
    }
  }

  return { addOneChild };
}
