import { generateRandomColor } from "./helpers/randomColor";
import { useVueFlow, MarkerType } from "@vue-flow/core";
import { useVueFlowHelper } from "./helpers/useVueFlowHelper";
import { inject } from "vue";

export function useNodeAddition() {
  const {
    getNodes,
    addNodes,
    addEdges,
    removeEdges,
    getOutgoers,
    updateNodeData,
    findNode,
  } = useVueFlow();

  const allGotoEdgesArray = inject("allGotoEdgesArray");

  function updateEndNodePosition(newYPosition) {
    addNodes({
      id: "end",
      type: "startend",
      label: "Stop",
      position: { x: 300, y: newYPosition },
    });
  }

  const { getAllDescendants } = useVueFlowHelper();

  // 1.
  function addOneChild(
    nodeId,
    outgoingEdgesOfClickedNode,
    offset,
    props,
    inputNodeType1 = "child",
    inputLabel1
  ) {
    //remove all the gotoedge first:
    allGotoEdgesArray.forEach((gotoEdge) => removeEdges(gotoEdge.id));

    //perform addition:

    const outgoerIds = getOutgoers(nodeId).map((node) => node.id);

    const outgoingEdgesId = outgoingEdgesOfClickedNode.value
      .filter((edge) => !edge.edgeId.includes("goto"))
      .map((edge) => edge.edgeId);

    const endNode = getNodes.value.find((node) => node.id === "end");
    const endNodeYPosition = endNode.position.y;

    if (outgoerIds.includes("end")) {
      removeEdges([...outgoingEdgesId]);

      offset.value = endNodeYPosition - props.position.y;

      if (offset.value < 251) {
        updateEndNodePosition(endNodeYPosition + 250);
      }

      const newChildNodeId = (Math.random() * 100).toFixed(2);
      addNodes({
        id: `node-${newChildNodeId}`,
        label: inputLabel1,
        type: inputNodeType1,
        position: {
          x:
            findNode(nodeId).type === "handle"
              ? props.position.x - 70
              : props.position.x,
          y: props.position.y + 250,
        },
      });

      addEdges([
        {
          id: `edge-${(Math.random() * 1000).toFixed(3)}`,
          label: ``,
          type: "straight",
          source: nodeId,
          target: `node-${newChildNodeId}`,
        },
        {
          id: `end-edge`,
          label: "",
          type: "straight",
          source: `node-${newChildNodeId}`,
          target: "end",
        },
      ]);
    } else {
      const newChildNodeId = (Math.random() * 100).toFixed(2);

      const parentHandleDataIdHandleToAddMultiple =
        findNode(nodeId).data.idHandleToAddMultiple;

      const newNode = {
        id: `node-${newChildNodeId}`,
        label: inputLabel1,
        type: inputNodeType1,
        position: {
          x:
            findNode(nodeId).type === "handle"
              ? props.position.x - 70
              : props.position.x,
          y: props.position.y + 250,
        },
        data: {
          ...(parentHandleDataIdHandleToAddMultiple !== undefined && {
            idHandleToAddMultiple: parentHandleDataIdHandleToAddMultiple,
          }),
        },
      };

      addNodes(newNode);

      addEdges([
        {
          id: `edge-${(Math.random() * 1000).toFixed(3)}`,
          label: ``,
          source: nodeId,
          type: "straight",
          target: `node-${newChildNodeId}`,
          animated: true,
          markerEnd: MarkerType.ArrowClosed,
          style: { stroke: generateRandomColor() },
          style: { strokeWidth: 2 },
        },
      ]);

      if (!outgoerIds.includes("end")) {
        outgoerIds.forEach((value) => {
          addEdges({
            id: `edge-${(Math.random() * 1000).toFixed(5)}`,
            label: ``,
            source: `node-${newChildNodeId}`,
            target: value,
            type: outgoerIds.length > 1 ? "smoothstep" : "straight",
            animated: true,
            markerEnd: MarkerType.ArrowClosed,
            style: { stroke: generateRandomColor() },
          });
        });
      }

      removeEdges([...outgoingEdgesId]);

      const IdsNodeToShift = getAllDescendants(nodeId).filter(
        (id) => id !== `node-${newChildNodeId}`
      );

      IdsNodeToShift.forEach((id) => {
        const tempNode = findNode(id);

        addNodes({
          id: tempNode.id,
          label: tempNode.label,
          type: tempNode.type,
          position: { x: tempNode.position.x, y: tempNode.position.y + 250 },
        });
      });
    }

    //now add all those edges as they were
    addEdges(allGotoEdgesArray);
  }

  //2.
  function addMultipleChild(
    inputNodeType1 = "child",
    inputNodeType2 = "child",
    inputLabel1,
    inputLabel2,
    outgoingEdgesOfClickedNode,
    nodeId,
    props
  ) {
    //remove all goto edges first
    allGotoEdgesArray.forEach((gotoEdge) => removeEdges(gotoEdge.id));

    //then add the multiple child
    const outgoingEdgesOfClickedNodeIds = outgoingEdgesOfClickedNode.value.map(
      (edge) => edge.edgeId
    );

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
          label: inputLabel1,
          type: inputNodeType1,
          position: { x: props.position.x - 350, y: props.position.y + 225 },
          data: { hasSibling: true },
        },
        {
          id: `node-${nodeIdForNewChildNode2}`,
          label: inputLabel2,
          type: inputNodeType2,
          position: { x: props.position.x + 400, y: props.position.y + 225 },
          data: { hasSibling: true },
        },
        {
          id: `handle-${nodeIdForNewHandleNode}`,
          label: `+`,
          type: "handle",
          position: {
            x:
              props.type === "handle"
                ? props.position.x
                : props.position.x + 150,
            y: props.position.y + 450,
          },
        },
      ]);

      updateNodeData(nodeId, {
        idHandleToAddMultiple: `handle-${nodeIdForNewHandleNode}`,
      });

      const endNodeYPosition = findNode("end").position.y;
      const handleNodePositionY = getNodes.value.find(
        (node) => node.id === `handle-${nodeIdForNewHandleNode}`
      ).position.y;
      const offset = endNodeYPosition - handleNodePositionY;

      //it would re-render the node. won't have to worry of first removing the node before doing it.
      offset < 251 &&
        addNodes({
          id: "end",
          type: "startend",
          label: "Stop",
          position: { x: 498, y: handleNodePositionY + 250 },
        });

      const edgeIdForNewEdge1 = (Math.random() * 1000).toFixed(4);
      const edgeIdForNewEdge2 = (Math.random() * 1000).toFixed(4);

      const edgeIdForNewEndEdge1 = (Math.random() * 1000).toFixed(5);
      const edgeIdForNewEndEdge2 = (Math.random() * 1000).toFixed(5);
      const randColor1 = generateRandomColor();
      const randColor2 = generateRandomColor();

      addEdges([
        //first childnode to current node
        {
          id: `edge-${edgeIdForNewEdge1}`,
          label: ``,
          type: "smoothstep",
          source: nodeId,
          target: `node-${nodeIdForNewChildNode1}`,
        },
        //second childnode to current node
        {
          id: `edge-${edgeIdForNewEdge2}`,
          label: ``,
          type: "smoothstep",
          source: nodeId,
          target: `node-${nodeIdForNewChildNode2}`,
        },
        //first childnode to handle node
        {
          id: `handle-edge-${edgeIdForNewEndEdge1}`,
          label: ``,
          type: "smoothstep",
          source: `node-${nodeIdForNewChildNode1}`,
          target: `handle-${nodeIdForNewHandleNode}`,
        },
        //second childnode to handle node
        {
          id: `handle-edge-${edgeIdForNewEndEdge2}`,
          label: ``,
          type: "smoothstep",
          source: `node-${nodeIdForNewChildNode2}`,
          target: `handle-${nodeIdForNewHandleNode}`,
        },
        //handlenode to end node. addEdge isn't over-written so no need to worry about removing it if the node clicked isn't parent of end edge
        {
          id: "end-edge",
          type: "straight",
          source: `handle-${nodeIdForNewHandleNode}`,
          target: "end",
        },
      ]);

      // console.log(outgoerIds, outgoerIds.includes("end"));

      if (!outgoerIds.includes("end")) {
        outgoerIds.forEach((value) => {
          const newEdgeHandle = (Math.random() * 1000).toFixed(5);

          addEdges({
            id: `edge-${newEdgeHandle}`,
            label: ``,
            type: "straight",
            source: `handle-${nodeIdForNewHandleNode}`,
            target: value,
            animated: true,
            markerEnd: MarkerType.ArrowClosed,
            style: { stroke: generateRandomColor() },
          });
        });

        //Logic of redrawing every child[Outgoing] node further down
        let goerIds = getNodes.value
          .filter((node) => node.id === `handle-${nodeIdForNewHandleNode}`)
          .map((node) => node.id);

        while (!goerIds.includes("end")) {
          const tempNodes = getOutgoers(goerIds[0]); //0 coz numHandle always gonna be 1

          tempNodes.map((tempNode) => {
            //redrawing of nodes(not edges) coz edges will arrange w.r.t. nodes
            addNodes({
              id: tempNode.id,
              label: tempNode.label,
              type: tempNode.type,
              position: {
                x: tempNode.position.x,
                y: tempNode.position.y + 250,
              },
            });

            goerIds[0] = tempNode.id;
          });
        }
      }
    } else {
      console.log("multiple outgoers po xan ta");
      console.log(inputLabel1, inputNodeType1);
      const handleIdToBeConnected = findNode(nodeId).data.idHandleToAddMultiple;
      console.log(findNode(nodeId).data);
      console.log("handleId", handleIdToBeConnected);
      const newNode = (Math.random() * 1000).toFixed(4);

      const referenceNode = getOutgoers(nodeId)[getOutgoers(nodeId).length - 1];
      console.log("reference node", referenceNode);

      addNodes({
        id: `node-${newNode}`,
        label: inputLabel1,
        type: inputNodeType1,
        position: {
          x: referenceNode.position.x + 250,
          y: referenceNode.position.y,
        },
        data: {
          hasSibling: true,
        },
      });

      const edgeNewtoCur = (Math.random() * 10000).toFixed(2);
      const curToHandle = (Math.random() * 10000).toFixed(2);
      const randColor = generateRandomColor();

      addEdges([
        {
          id: `edge-${edgeNewtoCur}`,
          label: ``,
          type: "smoothstep",
          source: nodeId,
          target: `node-${newNode}`,
          animated: true,
          markerEnd: MarkerType.ArrowClosed,
          style: { stroke: randColor },
        },
        {
          id: `edge-${curToHandle}`,
          label: ``,
          type: "default",
          source: `node-${newNode}`,
          target: handleIdToBeConnected,
          animated: true,
          markerEnd: MarkerType.ArrowClosed,
          style: { stroke: randColor },
        },
      ]);
    }

    //now redraw those edges as they are
    addEdges(allGotoEdgesArray);
  }

  return { addOneChild, addMultipleChild };
}
