import {
    useMemo,
} from "react";

import {
    createTimelineLayout,
} from "../../../utils/graphLayoutUtils";

import BaseForceGraph from "./BaseForceGraph";

const TimelineGraph = ({
                           graphData,
                       }) => {
    const layoutData =
        useMemo(
            () =>
                createTimelineLayout(
                    graphData,
                ),
            [graphData],
        );

    return (
        <BaseForceGraph
            graphData={layoutData}
            mode="timeline"
        />
    );
};

export default TimelineGraph;