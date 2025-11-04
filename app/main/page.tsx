// import React, { useState, useRef } from 'react';
// import { MessageSquare, Settings, Save, HelpCircle, GitBranch, Trash2 } from 'lucide-react';

// export default function ChatbotFlowBuilder() {
//   const [nodes, setNodes] = useState([]);
//   const [edges, setEdges] = useState([]);
//   const [selectedNode, setSelectedNode] = useState(null);
//   const [draggedNodeType, setDraggedNodeType] = useState(null);
//   const [connectingFrom, setConnectingFrom] = useState(null);
//   const [tempEdge, setTempEdge] = useState(null);
//   const canvasRef = useRef(null);

//   // Node type definitions
//   const nodeTypes = [
//     {
//       id: 'message',
//       label: 'Message Node',
//       icon: MessageSquare,
//       color: 'blue',
//       description: 'Send a text message'
//     },
//     {
//       id: 'question',
//       label: 'Question Node',
//       icon: HelpCircle,
//       color: 'purple',
//       description: 'Ask user for input'
//     },
//     {
//       id: 'condition',
//       label: 'Condition Node',
//       icon: GitBranch,
//       color: 'green',
//       description: 'Branch based on logic'
//     }
//   ];

//   // Handle drag start from node library
//   const handleDragStart = (e, nodeType) => {
//     setDraggedNodeType(nodeType);
//   };

//   // Handle drag over canvas
//   const handleDragOver = (e) => {
//     e.preventDefault();
//   };

//   // Handle drop on canvas
//   const handleDrop = (e) => {
//     e.preventDefault();
//     if (!draggedNodeType || !canvasRef.current) return;

//     const rect = canvasRef.current.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;

//     const newNode = {
//       id: `node_${Date.now()}`,
//       type: draggedNodeType.id,
//       label: draggedNodeType.label,
//       icon: draggedNodeType.icon,
//       color: draggedNodeType.color,
//       position: { x, y },
//       data: {
//         message: draggedNodeType.id === 'message' ? 'Enter your message here' : '',
//         question: draggedNodeType.id === 'question' ? 'What would you like to ask?' : '',
//         condition: draggedNodeType.id === 'condition' ? 'if condition' : ''
//       }
//     };

//     setNodes([...nodes, newNode]);
//     setSelectedNode(newNode);
//     setDraggedNodeType(null);
//   };

//   // Handle node click
//   const handleNodeClick = (e, node) => {
//     e.stopPropagation();
//     setSelectedNode(node);
//   };

//   // Handle canvas click (deselect)
//   const handleCanvasClick = () => {
//     setSelectedNode(null);
//     setConnectingFrom(null);
//     setTempEdge(null);
//   };

//   // Handle node drag on canvas
//   const handleNodeDragStart = (e, node) => {
//     e.dataTransfer.effectAllowed = 'move';
//     e.dataTransfer.setData('nodeId', node.id);
//   };

//   const handleNodeDragOnCanvas = (e) => {
//     e.preventDefault();
//   };

//   const handleNodeDropOnCanvas = (e) => {
//     e.preventDefault();
//     const nodeId = e.dataTransfer.getData('nodeId');
//     if (!nodeId || !canvasRef.current) return;

//     const rect = canvasRef.current.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;

//     setNodes(nodes.map(node => 
//       node.id === nodeId 
//         ? { ...node, position: { x: x - 100, y: y - 40 } }
//         : node
//     ));
//   };

//   // Connection handling
//   const startConnection = (e, nodeId) => {
//     e.stopPropagation();
//     setConnectingFrom(nodeId);
//   };

//   const handleMouseMove = (e) => {
//     if (!connectingFrom || !canvasRef.current) return;
    
//     const rect = canvasRef.current.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;
    
//     const fromNode = nodes.find(n => n.id === connectingFrom);
//     if (fromNode) {
//       setTempEdge({
//         from: { x: fromNode.position.x + 104, y: fromNode.position.y + 80 },
//         to: { x, y }
//       });
//     }
//   };

//   const endConnection = (e, targetNodeId) => {
//     e.stopPropagation();
//     if (!connectingFrom || connectingFrom === targetNodeId) {
//       setConnectingFrom(null);
//       setTempEdge(null);
//       return;
//     }

//     // Check if edge already exists
//     const edgeExists = edges.some(
//       edge => edge.from === connectingFrom && edge.to === targetNodeId
//     );

//     if (!edgeExists) {
//       setEdges([...edges, {
//         id: `edge_${Date.now()}`,
//         from: connectingFrom,
//         to: targetNodeId
//       }]);
//     }

//     setConnectingFrom(null);
//     setTempEdge(null);
//   };

//   // Update node data
//   const updateNodeData = (field, value) => {
//     if (!selectedNode) return;
    
//     setNodes(nodes.map(node =>
//       node.id === selectedNode.id
//         ? { ...node, data: { ...node.data, [field]: value } }
//         : node
//     ));
    
//     setSelectedNode({
//       ...selectedNode,
//       data: { ...selectedNode.data, [field]: value }
//     });
//   };

//   // Delete selected node
//   const deleteNode = () => {
//     if (!selectedNode) return;
//     // Remove node and all connected edges
//     setEdges(edges.filter(edge => edge.from !== selectedNode.id && edge.to !== selectedNode.id));
//     setNodes(nodes.filter(node => node.id !== selectedNode.id));
//     setSelectedNode(null);
//   };

//   // Delete edge
//   const deleteEdge = (e, edgeId) => {
//     e.stopPropagation();
//     setEdges(edges.filter(edge => edge.id !== edgeId));
//   };

//   // Get color classes
//   const getColorClasses = (color) => {
//     const colors = {
//       blue: 'from-blue-50 to-blue-100 border-blue-300 text-blue-600',
//       purple: 'from-purple-50 to-purple-100 border-purple-300 text-purple-600',
//       green: 'from-green-50 to-green-100 border-green-300 text-green-600'
//     };
//     return colors[color] || colors.blue;
//   };

//   // Draw edge
//   const drawEdge = (fromNode, toNode, edgeId) => {
//     const fromX = fromNode.position.x + 104;
//     const fromY = fromNode.position.y + 80;
//     const toX = toNode.position.x + 104;
//     const toY = toNode.position.y;

//     const midY = (fromY + toY) / 2;
//     const path = `M ${fromX} ${fromY} C ${fromX} ${midY}, ${toX} ${midY}, ${toX} ${toY}`;

//     return (
//       <g key={edgeId}>
//         <path
//           d={path}
//           fill="none"
//           stroke="#3b82f6"
//           strokeWidth="3"
//           className="cursor-pointer hover:stroke-red-500 transition-colors"
//           onClick={(e) => deleteEdge(e, edgeId)}
//         />
//         <circle
//           cx={toX}
//           cy={toY}
//           r="5"
//           fill="#3b82f6"
//         />
//       </g>
//     );
//   };

//   return (
//     <div className="flex h-screen bg-gray-50 overflow-hidden">
//       {/* Left Panel - Node Library */}
//       <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
//         <div className="p-4 border-b border-gray-200">
//           <h2 className="text-lg font-semibold text-gray-800">Node Library</h2>
//           <p className="text-xs text-gray-500 mt-1">Drag to add nodes</p>
//         </div>
        
//         <div className="p-4 flex-1 overflow-y-auto">
//           <div className="space-y-3">
//             {nodeTypes.map((nodeType) => {
//               const Icon = nodeType.icon;
//               return (
//                 <div 
//                   key={nodeType.id}
//                   className={`p-4 bg-gradient-to-r ${getColorClasses(nodeType.color)} border-2 rounded-lg cursor-grab hover:shadow-md transition-shadow active:cursor-grabbing`}
//                   draggable
//                   onDragStart={(e) => handleDragStart(e, nodeType)}
//                 >
//                   <div className="flex items-center gap-2">
//                     <Icon className="w-5 h-5" />
//                     <span className="font-medium text-gray-800">{nodeType.label}</span>
//                   </div>
//                   <p className="text-xs text-gray-600 mt-1">{nodeType.description}</p>
//                 </div>
//               );
//             })}
//           </div>

//           <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
//             <p className="text-xs font-medium text-blue-900 mb-2">💡 Quick Tips:</p>
//             <ul className="text-xs text-blue-700 space-y-1">
//               <li>• Click bottom dot to connect</li>
//               <li>• Click edge to delete it</li>
//               <li>• Drag nodes to reposition</li>
//             </ul>
//           </div>
//         </div>
//       </div>

//       {/* Center Panel - Canvas */}
//       <div className="flex-1 flex flex-col">
//         {/* Top Bar */}
//         <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
//           <div>
//             <h1 className="text-xl font-bold text-gray-800">Chatbot Flow Builder</h1>
//             <p className="text-xs text-gray-500">
//               {nodes.length} node{nodes.length !== 1 ? 's' : ''}, {edges.length} connection{edges.length !== 1 ? 's' : ''}
//             </p>
//           </div>
          
//           <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
//             <Save className="w-4 h-4" />
//             Save Flow
//           </button>
//         </div>

//         {/* Canvas Area */}
//         <div 
//           ref={canvasRef}
//           className="flex-1 bg-gray-50 relative overflow-auto"
//           onDragOver={handleDragOver}
//           onDrop={handleDrop}
//           onClick={handleCanvasClick}
//           onMouseMove={handleMouseMove}
//         >
//           <div 
//             className="min-w-full min-h-full bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:24px_24px]"
//             onDragOver={handleNodeDragOnCanvas}
//             onDrop={handleNodeDropOnCanvas}
//           >
//             {nodes.length === 0 ? (
//               <div className="w-full h-full flex items-center justify-center min-h-[600px]">
//                 <div className="text-center text-gray-400">
//                   <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
//                   <p className="text-lg font-medium">Drag nodes here to start building</p>
//                   <p className="text-sm mt-2">Create your chatbot conversation flow</p>
//                 </div>
//               </div>
//             ) : (
//               <div className="relative w-full h-full min-h-[600px]">
//                 {/* SVG for edges */}
//                 <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
//                   {edges.map(edge => {
//                     const fromNode = nodes.find(n => n.id === edge.from);
//                     const toNode = nodes.find(n => n.id === edge.to);
//                     if (fromNode && toNode) {
//                       return drawEdge(fromNode, toNode, edge.id);
//                     }
//                     return null;
//                   })}
                  
//                   {/* Temporary edge while connecting */}
//                   {tempEdge && (
//                     <line
//                       x1={tempEdge.from.x}
//                       y1={tempEdge.from.y}
//                       x2={tempEdge.to.x}
//                       y2={tempEdge.to.y}
//                       stroke="#3b82f6"
//                       strokeWidth="2"
//                       strokeDasharray="5,5"
//                     />
//                   )}
//                 </svg>

//                 {/* Nodes */}
//                 {nodes.map((node) => {
//                   const Icon = node.icon;
//                   const isSelected = selectedNode?.id === node.id;
//                   const isConnecting = connectingFrom === node.id;
//                   return (
//                     <div
//                       key={node.id}
//                       className={`absolute w-52 bg-white rounded-lg shadow-lg border-2 transition-all cursor-move ${
//                         isSelected ? 'border-blue-500 shadow-xl' : isConnecting ? 'border-green-500 shadow-xl' : 'border-gray-300'
//                       }`}
//                       style={{
//                         left: node.position.x,
//                         top: node.position.y,
//                         zIndex: 10
//                       }}
//                       onClick={(e) => handleNodeClick(e, node)}
//                       draggable
//                       onDragStart={(e) => handleNodeDragStart(e, node)}
//                     >
//                       <div className={`p-3 bg-gradient-to-r ${getColorClasses(node.color)} rounded-t-lg border-b-2`}>
//                         <div className="flex items-center gap-2">
//                           <Icon className="w-5 h-5" />
//                           <span className="font-medium text-gray-800 text-sm">{node.label}</span>
//                         </div>
//                       </div>
//                       <div className="p-3">
//                         <p className="text-sm text-gray-700 line-clamp-3">
//                           {node.data.message || node.data.question || node.data.condition}
//                         </p>
//                       </div>
                      
//                       {/* Connection points */}
//                       <div 
//                         className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-green-400 rounded-full border-2 border-white cursor-pointer hover:bg-green-500 pointer-events-auto"
//                         style={{ zIndex: 20 }}
//                         onMouseDown={(e) => {
//                           e.stopPropagation();
//                           endConnection(e, node.id);
//                         }}
//                       ></div>
//                       <div 
//                         className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-blue-400 rounded-full border-2 border-white cursor-pointer hover:bg-blue-500 pointer-events-auto"
//                         style={{ zIndex: 20 }}
//                         onMouseDown={(e) => {
//                           e.stopPropagation();
//                           startConnection(e, node.id);
//                         }}
//                       ></div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Right Panel - Settings */}
//       <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
//         <div className="p-4 border-b border-gray-200">
//           <div className="flex items-center gap-2">
//             <Settings className="w-5 h-5 text-gray-600" />
//             <h2 className="text-lg font-semibold text-gray-800">Node Settings</h2>
//           </div>
//         </div>
        
//         <div className="flex-1 p-4 overflow-y-auto">
//           {selectedNode ? (
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Node Type
//                 </label>
//                 <div className={`p-3 bg-gradient-to-r ${getColorClasses(selectedNode.color)} border-2 rounded-lg`}>
//                   <div className="flex items-center gap-2">
//                     <selectedNode.icon className="w-5 h-5" />
//                     <span className="font-medium text-gray-800">{selectedNode.label}</span>
//                   </div>
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Node ID
//                 </label>
//                 <input
//                   type="text"
//                   className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm text-gray-600"
//                   value={selectedNode.id}
//                   disabled
//                 />
//               </div>

//               {selectedNode.type === 'message' && (
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Message Text
//                   </label>
//                   <textarea
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     rows="4"
//                     value={selectedNode.data.message}
//                     onChange={(e) => updateNodeData('message', e.target.value)}
//                     placeholder="Enter the message to send..."
//                   />
//                 </div>
//               )}

//               {selectedNode.type === 'question' && (
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Question Text
//                   </label>
//                   <textarea
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                     rows="4"
//                     value={selectedNode.data.question}
//                     onChange={(e) => updateNodeData('question', e.target.value)}
//                     placeholder="Enter the question to ask..."
//                   />
//                 </div>
//               )}

//               {selectedNode.type === 'condition' && (
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Condition Logic
//                   </label>
//                   <input
//                     type="text"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                     value={selectedNode.data.condition}
//                     onChange={(e) => updateNodeData('condition', e.target.value)}
//                     placeholder="e.g., user_age > 18"
//                   />
//                 </div>
//               )}

//               <div className="pt-4 border-t border-gray-200">
//                 <button
//                   onClick={deleteNode}
//                   className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
//                 >
//                   <Trash2 className="w-4 h-4" />
//                   Delete Node
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <div className="h-full flex items-center justify-center text-center text-gray-400">
//               <div>
//                 <Settings className="w-12 h-12 mx-auto mb-3 opacity-50" />
//                 <p className="text-sm">Select a node to edit its properties</p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }