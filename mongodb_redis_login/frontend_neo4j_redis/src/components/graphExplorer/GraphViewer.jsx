import ClusterGraph from "./views/ClusterGraph";
import HierarchyGraph from "./views/HierarchyGraph";
import NetworkGraph from "./views/NetworkGraph";
import RadialGraph from "./views/RadialGraph";
import TimelineGraph from "./views/TimelineGraph";

const GraphViewer = ({
                         graphType,
                         graphData,
                     }) => {
    switch (graphType) {
        case "radial":
            return (
                <RadialGraph
                    graphData={
                        graphData
                    }
                />
            );

        case "cluster":
            return (
                <ClusterGraph
                    graphData={
                        graphData
                    }
                />
            );

        case "timeline":
            return (
                <TimelineGraph
                    graphData={
                        graphData
                    }
                />
            );

        case "hierarchy":
            return (
                <HierarchyGraph
                    graphData={
                        graphData
                    }
                />
            );

        case "network":
        default:
            return (
                <NetworkGraph
                    graphData={
                        graphData
                    }
                />
            );
    }
};

export default GraphViewer;