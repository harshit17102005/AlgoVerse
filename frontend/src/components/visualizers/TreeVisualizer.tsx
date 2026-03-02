import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVisualizerStore } from '../../store/useVisualizerStore';
import * as d3 from 'd3';

interface TreeNode {
    id: string;
    value: number | string;
    left?: TreeNode | null;
    right?: TreeNode | null;
}

interface TreeState {
    tree: TreeNode | null;
}

const DEPTH_COLORS = [
    { border: 'border-sky-400/60', bg: 'bg-sky-500/20', shadow: 'shadow-[0_0_20px_rgba(14,165,233,0.3)]', text: 'text-sky-100', edge: 'rgba(14,165,233,0.5)' },
    { border: 'border-emerald-400/60', bg: 'bg-emerald-500/20', shadow: 'shadow-[0_0_20px_rgba(16,185,129,0.3)]', text: 'text-emerald-100', edge: 'rgba(16,185,129,0.5)' },
    { border: 'border-violet-400/60', bg: 'bg-violet-500/20', shadow: 'shadow-[0_0_20px_rgba(139,92,246,0.3)]', text: 'text-violet-100', edge: 'rgba(139,92,246,0.5)' },
    { border: 'border-amber-400/60', bg: 'bg-amber-500/20', shadow: 'shadow-[0_0_20px_rgba(245,158,11,0.3)]', text: 'text-amber-100', edge: 'rgba(245,158,11,0.5)' },
    { border: 'border-fuchsia-400/60', bg: 'bg-fuchsia-500/20', shadow: 'shadow-[0_0_20px_rgba(217,70,239,0.3)]', text: 'text-fuchsia-100', edge: 'rgba(217,70,239,0.5)' },
    { border: 'border-teal-400/60', bg: 'bg-teal-500/20', shadow: 'shadow-[0_0_20px_rgba(20,184,166,0.3)]', text: 'text-teal-100', edge: 'rgba(20,184,166,0.5)' },
    { border: 'border-indigo-400/60', bg: 'bg-indigo-500/20', shadow: 'shadow-[0_0_20px_rgba(99,102,241,0.3)]', text: 'text-indigo-100', edge: 'rgba(99,102,241,0.5)' },
];

const getDepthColors = (depth: number) => {
    return DEPTH_COLORS[depth % DEPTH_COLORS.length];
};

export const TreeVisualizer: React.FC = () => {
    const { animation, currentStepIndex } = useVisualizerStore();

    const currentStep = animation?.steps[currentStepIndex];
    const state = (currentStep?.state as TreeState) || { tree: null };
    const root = state.tree;
    const highlights = currentStep?.highlights || [];

    // Use D3 to calculate tree layout
    const { nodes, links, scale } = useMemo(() => {
        if (!root) return { nodes: [], links: [], scale: 1 };

        // Convert to D3 hierarchy
        const hierarchy = d3.hierarchy<TreeNode>(root, d => {
            const children = [];
            // D3 expects array of children. If left/right exist we push them,
            // If one is missing but the other exists, we need to push a dummy node
            // to maintain correct Left/Right visual structure in binary trees.
            if (d.left || d.right) {
                children.push(d.left || { id: `dummy-l-${d.id}`, value: '', isDummy: true });
                children.push(d.right || { id: `dummy-r-${d.id}`, value: '', isDummy: true });
            }
            return children as TreeNode[];
        });

        // Create a tree layout with more breathing room to prevent overlaps
        const treeLayout = d3.tree<TreeNode>().nodeSize([100, 120]);
        const rootNode = treeLayout(hierarchy);

        const nodesList = rootNode.descendants();
        const linksList = rootNode.links();

        let minX = 0;
        let maxX = 0;
        let maxY = 0;

        // Shift nodes down from the top edge and find bounds
        nodesList.forEach(n => {
            n.y += 60; // top padding
            if (!((n.data as any).isDummy)) {
                if (n.x < minX) minX = n.x;
                if (n.x > maxX) maxX = n.x;
                if (n.y > maxY) maxY = n.y;
            }
        });

        // Calculate dynamic scale to ensure tree fits within the 500px container bounds without overflowing
        const treeWidth = maxX - minX + 160;   // Add 160 padding for width
        const treeHeight = maxY + 100;         // Add 100 padding for height

        // Assuming max available width is ~600px before interfering with UI, and height is 400px
        const scaleX = 600 / Math.max(treeWidth, 1);
        const scaleY = 400 / Math.max(treeHeight, 1);
        const finalScale = Math.min(1.8, scaleX, scaleY);

        return { nodes: nodesList, links: linksList, scale: finalScale };
    }, [root]);

    if (!currentStep) return null;

    return (
        <div className="relative w-full h-[500px] flex justify-center items-start overflow-hidden pointer-events-none">

            <motion.div
                className="relative w-0 h-full origin-top"
                animate={{ scale }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
            >
                {/* Edges - SVG Layer */}
                <svg className="absolute top-0 -left-[1000px] w-[2000px] h-full pointer-events-none overflow-visible">
                    <g transform="translate(1000, 0)">
                        <AnimatePresence>
                            {links.map((link) => {
                                if ((link.target.data as any).isDummy || (link.source.data as any).isDummy) return null;

                                const sourceHighlight = highlights.includes(link.source.data.id) || highlights.includes(String(link.source.data.value));
                                const targetHighlight = highlights.includes(link.target.data.id) || highlights.includes(String(link.target.data.value));
                                const isHighlightedEdge = sourceHighlight && targetHighlight;
                                const edgeColor = getDepthColors(link.target.depth).edge;

                                return (
                                    <motion.path
                                        key={`${link.source.data.id}-${link.target.data.id}`}
                                        initial={{
                                            opacity: 0,
                                            pathLength: 0,
                                            d: `M ${link.source.x} ${link.source.y} L ${link.target.x} ${link.target.y}`
                                        }}
                                        animate={{
                                            opacity: 1,
                                            pathLength: 1,
                                            stroke: isHighlightedEdge ? '#fda4af' : edgeColor,
                                            strokeWidth: isHighlightedEdge ? 4 : 2,
                                            d: `M ${link.source.x} ${link.source.y} L ${link.target.x} ${link.target.y}`
                                        }}
                                        exit={{ opacity: 0 }}
                                        transition={{
                                            d: { type: "spring", stiffness: 300, damping: 25 },
                                            opacity: { duration: 0.2 },
                                            default: { duration: 0.3, ease: "easeInOut" }
                                        }}
                                        fill="none"
                                        className="transition-colors drop-shadow-md"
                                    />
                                );
                            })}
                        </AnimatePresence>
                    </g>
                </svg>

                {/* Nodes - HTML Layer */}
                <div className="absolute top-0 left-0 w-0 h-full pointer-events-none">
                    <AnimatePresence>
                        {nodes.map((node) => {
                            if ((node.data as any).isDummy) return null;

                            const isHighlighted = highlights.includes(node.data.id) || highlights.includes(String(node.data.value));
                            const colors = getDepthColors(node.depth);

                            return (
                                <motion.div
                                    key={node.data.id}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{
                                        opacity: 1,
                                        scale: 1,
                                        x: node.x - 32, // center offset (width/2 for w-16)
                                        y: node.y - 32,
                                    }}
                                    exit={{ opacity: 0, scale: 0 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                    className={`
                                      absolute w-16 h-16 rounded-full border flex items-center justify-center font-space font-light text-2xl
                                      transition-all duration-500 pointer-events-auto backdrop-blur-md
                                      ${isHighlighted
                                            ? 'border-rose-400/60 bg-rose-500/20 text-white shadow-[0_0_30px_rgba(244,63,94,0.4)] scale-110 z-10'
                                            : `${colors.border} ${colors.bg} ${colors.text} ${colors.shadow} z-0`
                                        }
                                    `}
                                >
                                    {node.data.value}
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};
