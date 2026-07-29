import {
    useMemo,
} from "react";

import {
    createClusterLayout,
} from "../../../utils/graphLayoutUtils";

import BaseForceGraph from "./BaseForceGraph";

const ClusterGraph = ({
                          graphData,
                      }) => {
    const layoutData =
        useMemo(
            () =>
                createClusterLayout(
                    graphData,
                ),
            [graphData],
        );

    return (
        <BaseForceGraph
            graphData={layoutData}
            mode="cluster"
        />
    );
};

export default ClusterGraph;