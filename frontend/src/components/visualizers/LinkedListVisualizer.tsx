import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVisualizerStore } from '../../store/useVisualizerStore';

interface LinkedListNode {
    id: string;
    value: string | number;
    next?: string | null; // ID of the next node
}

export const LinkedListVisualizer: React.FC = () => {
    const { animation, currentStepIndex } = useVisualizerStore();

    const currentStep = animation?.steps[currentStepIndex];
    if (!currentStep) return null;

    // Robust parsing of the linked list array from the state
    let nodes: LinkedListNode[] = [];
    const state = currentStep.state as Record<string, any>;

    if (Array.isArray(state)) {
        nodes = state.map((v, i) => typeof v === 'object' ? v : { id: String(i), value: v, next: i < state.length - 1 ? String(i + 1) : null });
    } else if (state.linked_list && Array.isArray(state.linked_list)) {
        nodes = state.linked_list;
    } else if (state.linkedList && Array.isArray(state.linkedList)) {
        nodes = state.linkedList;
    } else if (state.list && Array.isArray(state.list)) {
        nodes = state.list;
    } else if (state.nodes && Array.isArray(state.nodes)) {
        nodes = state.nodes;
    } else if (state.array && Array.isArray(state.array)) {
        nodes = state.array;
    } else if (typeof state === 'object' && state !== null) {
        // Did it nest it?
        const possibleArrayKey = Object.keys(state).find(k => Array.isArray(state[k]));
        if (possibleArrayKey) {
            nodes = state[possibleArrayKey];
        } else {
            // Fallback: nested linked structure { id, value, next: { ... } }
            let curr: any = state.head || state.list || state.node || state;
            const seen = new Set();
            while (curr && (curr.value !== undefined || curr.data !== undefined) && !seen.has(curr)) {
                seen.add(curr);
                nodes.push({ id: curr.id || String(Math.random()), value: curr.value !== undefined ? curr.value : curr.data, next: curr.next?.id });
                curr = curr.next;
            }
        }
    }

    // Normalize nodes (if model provided raw values in the array or `{data}` instead of `{value}`)
    nodes = nodes.map((n: any, i) => {
        if (typeof n !== 'object') {
            return { id: String(i), value: n, next: i < nodes.length - 1 ? String(i + 1) : null };
        }
        return {
            id: n.id || String(i),
            value: n.value !== undefined ? n.value : (n.data !== undefined ? n.data : JSON.stringify(n)),
            next: n.next !== undefined ? n.next : (i < nodes.length - 1 ? String(i + 1) : null)
        };
    });

    // DEBUGGING LOG
    console.log("[LinkedListVisualizer] Raw state:", state);
    console.log("[LinkedListVisualizer] Parsed nodes:", nodes);

    const highlights = currentStep.highlights || [];
    const pointers = currentStep.pointers || {};

    // Sort logic to visually connect nodes in correct logical order if they represent a sequence
    // A more advanced graph visualizer builds edges, but a LL is linear. We'll simply map them linearly.

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 overflow-hidden">
            <div className="relative flex flex-nowrap justify-start items-center gap-x-16 gap-y-12 overflow-x-auto w-full max-w-full pb-12 custom-scrollbar">
                <AnimatePresence mode="popLayout">
                    {nodes.map((node, index) => {
                        const isHighlighted = highlights.includes(String(node.id)) || highlights.includes(String(node.value)) || highlights.includes(String(index));

                        // Find any active pointers tracking this node (e.g. `head`, `curr`, `prev`)
                        const activePointers = Object.entries(pointers)
                            .filter(([_, ptrValue]) => String(ptrValue) === String(node.id) || String(ptrValue) === String(index) || String(ptrValue) === String(node.value))
                            .map(([key]) => key);

                        // Always label the first node as HEAD and last node as TAIL
                        if (index === 0 && !activePointers.map(p => p.toLowerCase()).includes('head')) {
                            activePointers.unshift('HEAD');
                        }
                        if (index === nodes.length - 1 && !activePointers.map(p => p.toLowerCase()).includes('tail')) {
                            activePointers.push('TAIL');
                        }

                        return (
                            <div key={node.id} className="relative flex items-center shrink-0">
                                {/* The Data Node */}
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.5, y: -20 }}
                                    animate={{
                                        opacity: 1,
                                        scale: 1,
                                        y: 0,
                                        transition: { type: "spring", stiffness: 300, damping: 20 }
                                    }}
                                    exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                                    className={`
                                        relative w-24 h-16 flex rounded-xl border-2 backdrop-blur-md shadow-xl z-10
                                        ${isHighlighted
                                            ? 'border-emerald-400 bg-emerald-500/20 text-white shadow-[0_0_30px_rgba(52,211,153,0.3)]'
                                            : 'border-white/20 bg-white/5 text-zinc-300'}
                                    `}
                                >
                                    {/* Value Section */}
                                    <div className="flex-1 flex items-center justify-center font-space text-2xl font-medium border-r border-white/10">
                                        {node.value}
                                    </div>
                                    {/* Next Pointer Section */}
                                    <div className="w-6 flex items-center justify-center bg-white/5 rounded-r-xl">
                                        <div className="w-2 h-2 rounded-full bg-white/30" />
                                    </div>

                                    {/* Pointer Labels (e.g., "head", "curr", "tail") */}
                                    {activePointers.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="absolute -bottom-8 left-0 right-0 flex flex-col items-center gap-1"
                                        >
                                            {activePointers.map(ptr => (
                                                <span key={ptr} className="text-[10px] font-bold uppercase tracking-wider text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded-sm border border-rose-500/20">
                                                    {ptr}
                                                </span>
                                            ))}
                                        </motion.div>
                                    )}
                                </motion.div>

                                {/* Traversal Arrow */}
                                <motion.div
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: 64 }} /* 4rem gap */
                                    className="absolute left-full flex items-center z-0"
                                >
                                    <div className={`h-[2px] w-full shrink-0 transition-colors duration-300 ${isHighlighted ? 'bg-emerald-400/80 shadow-[0_0_15px_rgba(52,211,153,0.5)]' : 'bg-white/20'}`} />
                                    <div className={`absolute right-1 w-2.5 h-2.5 rotate-45 border-t-[2px] border-r-[2px] transition-colors duration-300 ${isHighlighted ? 'border-emerald-400/80 shadow-[2px_-2px_6px_rgba(52,211,153,0.5)]' : 'border-white/20'}`} style={{ marginRight: '-2px' }} />
                                </motion.div>
                            </div>
                        );
                    })}
                </AnimatePresence>

                {nodes.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center text-zinc-600 font-space font-medium ml-2"
                    >
                        [NULL]
                    </motion.div>
                )}
            </div>
        </div>
    );
};
