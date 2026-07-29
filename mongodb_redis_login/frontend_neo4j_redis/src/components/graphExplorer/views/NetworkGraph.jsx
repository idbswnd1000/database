import {
    useMemo,
} from "react";

import {
    createNetworkLayout,
} from "../../../utils/graphLayoutUtils";

import BaseForceGraph from "./BaseForceGraph";

const NetworkGraph = ({
                          graphData,
                      }) => {
    const layoutData =
        useMemo(
            () =>
                createNetworkLayout(
                    graphData,
                ),
            [graphData],
        );

    return (
        <BaseForceGraph
            graphData={layoutData}
            mode="network"
        />
    );
};

export default NetworkGraph;