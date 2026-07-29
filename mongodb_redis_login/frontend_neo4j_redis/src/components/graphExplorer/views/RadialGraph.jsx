import {
    useMemo,
} from "react";

import {
    createRadialLayout,
} from "../../../utils/graphLayoutUtils";

import BaseForceGraph from "./BaseForceGraph";

const RadialGraph = ({
                         graphData,
                     }) => {
    const layoutData =
        useMemo(
            () =>
                createRadialLayout(
                    graphData,
                ),
            [graphData],
        );

    return (
        <BaseForceGraph
            graphData={layoutData}
            mode="radial"
        />
    );
};

export default RadialGraph;