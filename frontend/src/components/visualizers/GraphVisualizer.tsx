import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVisualizerStore } from '../../store/useVisualizerStore';
import * as d3 from 'd3';

interface GraphNode {
    id: string;
    value: string;
    x?: number;
    y?: number;
}

interface GraphEdge {
    source: string;
    target: string;
    weight?: number;
}

interface GraphState {
    nodes: GraphNode[];
    edges: GraphEdge[];
}

const EMPTY_GRAPH_STATE: GraphState = { nodes: [], edges: [] };

export const GraphVisualizer: React.FC = () => {
    const { animation, currentStepIndex } = useVisualizerStore();
    const containerRef = useRef<HTMLDivElement>(null);

    // Hooks must be called before early return
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [simNodes, setSimNodes] = useState<any[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [simEdges, setSimEdges] = useState<any[]>([]);

    const currentStep = animation?.steps[currentStepIndex];
    const state = (currentStep?.state as GraphState) || EMPTY_GRAPH_STATE;
    const rawNodes = state.nodes || EMPTY_GRAPH_STATE.nodes;
    const rawEdges = state.edges || EMPTY_GRAPH_STATE.edges;
    const highlights = currentStep?.highlights || [];

    // D3 Force Simulation setup
    useEffect(() => {
        if (!containerRef.current || !currentStep) return;

        const width = 600;
        const height = 400;

        // We make a copy of nodes and edges because d3 mutates them
        const nodesCopy = rawNodes.map(n => ({ ...n }));
        const edgesCopy = rawEdges.map(e => ({ ...e, source: e.source, target: e.target }));

        // Detect if graph is linear (like a linked list)
        let isLinear = false;
        if (nodesCopy.length > 0) {
            const degree = new Map<string, number>();
            edgesCopy.forEach(e => {
                const s = e.source as string;
                const t = e.target as string;
                degree.set(s, (degree.get(s) || 0) + 1);
                degree.set(t, (degree.get(t) || 0) + 1);
            });
            const maxDegree = Math.max(...Array.from(degree.values()), 0);
            isLinear = maxDegree <= 2;
        }

        setSimNodes([]);
        setSimEdges([]);

        const simulation = d3.forceSimulation(nodesCopy)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .force("link", d3.forceLink(edgesCopy).id((d: any) => d.id).distance(100))
            .force("charge", d3.forceManyBody().strength(-400))
            .force("center", d3.forceCenter(width / 2, height / 2));

        if (isLinear) {
            simulation.force("y", d3.forceY(height / 2).strength(1));
            // Initialize positions so they don't tangle
            nodesCopy.forEach((n, i) => {
                n.x = (width / 2) + (i - nodesCopy.length / 2) * 100;
                n.y = height / 2;
            });
        }

        simulation.on("tick", () => {
            setSimNodes([...nodesCopy]);
            setSimEdges([...edgesCopy]);
        });

        // Run for a few ticks to stabilize initially
        for (let i = 0; i < 50; i++) simulation.tick();

        return () => {
            simulation.stop();
        };
    }, [rawNodes, rawEdges, currentStepIndex, animation]);

    if (!currentStep) return null;

    return (
        <div ref={containerRef} className="relative w-[600px] h-[400px]">

            {/* SVG Edges Layer */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none text-zinc-600 z-0">
                <defs>
                    <marker
                        id="arrowhead"
                        markerWidth="10"
                        markerHeight="7"
                        refX="9"
                        refY="3.5"
                        orient="auto"
                    >
                        <polygon points="0 0, 10 3.5, 0 7" fill="rgba(255,255,255,0.4)" />
                    </marker>
                    <marker
                        id="arrowhead-highlight"
                        markerWidth="10"
                        markerHeight="7"
                        refX="9"
                        refY="3.5"
                        orient="auto"
                    >
                        <polygon points="0 0, 10 3.5, 0 7" fill="#fda4af" />
                    </marker>
                </defs>
                <AnimatePresence>
                    {simEdges.map((edge) => {
                        const sourceHighlight = highlights.includes(edge.source.id);
                        const targetHighlight = highlights.includes(edge.target.id);
                        const isHighlightedEdge = sourceHighlight && targetHighlight;

                        // Calculate the edge coordinates from border to border (r=32)
                        const dx = edge.target.x - edge.source.x;
                        const dy = edge.target.y - edge.source.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        const nodeRadius = 32;

                        let x1 = edge.source.x;
                        let y1 = edge.source.y;
                        let x2 = edge.target.x;
                        let y2 = edge.target.y;

                        if (distance > nodeRadius * 2) {
                            x1 = edge.source.x + (dx * nodeRadius) / distance;
                            y1 = edge.source.y + (dy * nodeRadius) / distance;
                            x2 = edge.target.x - (dx * nodeRadius) / distance;
                            y2 = edge.target.y - (dy * nodeRadius) / distance;
                        }

                        return (
                            <g key={`${edge.source.id}-${edge.target.id}`}>
                                <motion.line
                                    initial={{ opacity: 0 }}
                                    animate={{
                                        opacity: 1,
                                        stroke: isHighlightedEdge ? '#fda4af' : 'rgba(255,255,255,0.15)',
                                        strokeWidth: isHighlightedEdge ? 4 : 2,
                                        x1: edge.source.x,
                                        y1: edge.source.y,
                                        x2: edge.target.x,
                                        y2: edge.target.y,
                                    }}
                                    x1={x1}
                                    y1={y1}
                                    x2={x2}
                                    y2={y2}
                                    markerEnd={isHighlightedEdge ? "url(#arrowhead-highlight)" : "url(#arrowhead)"}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    className="transition-colors duration-500"
                                />

                                {/* Edge Weight Optional Label */}
                                {edge.weight && (
                                    <text
                                        x={(edge.source.x + edge.target.x) / 2}
                                        y={(edge.source.y + edge.target.y) / 2 - 10}
                                        fill="#a1a1aa"
                                        fontSize="12"
                                        textAnchor="middle"
                                    >
                                        {edge.weight}
                                    </text>
                                )}
                            </g>
                        );
                    })}
                </AnimatePresence>
            </svg>

            {/* HTML Nodes Layer */}
            <div className="absolute inset-0 w-full h-full pointer-events-none z-10">
                <AnimatePresence>
                    {simNodes.map((node) => {
                        const isHighlighted = highlights.includes(node.id) || highlights.includes(node.value);

                        return (
                            <motion.div
                                key={node.id}
                                layout
                                layoutId={`graph-node-${node.id}`}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    x: node.x - 32, // w-16 = 64px, offset 32px for center
                                    y: node.y - 32,
                                }}
                                exit={{ opacity: 0, scale: 0 }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                className={`
                  absolute top-0 left-0 w-16 h-16 rounded-full border flex flex-col items-center justify-center font-space font-light text-2xl
                  transition-colors duration-500 pointer-events-auto backdrop-blur-md
                  ${isHighlighted
                                        ? 'border-rose-400/60 bg-rose-500/20 text-white shadow-[0_0_30px_rgba(244,63,94,0.4)] z-20'
                                        : 'border-white/10 bg-white/5 text-white/80 shadow-[0_10px_40px_rgba(0,0,0,0.2)] z-10'
                                    }
                `}
                            >
                                <span className="absolute -top-6 text-[10px] text-white/30 uppercase font-bold tracking-widest">{node.id}</span>
                                {node.value}
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

        </div>
    );
};
