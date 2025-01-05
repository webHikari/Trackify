import React, { useEffect, useState } from "react";
import Trackify from "../lib/Trackify";

const TrackifyPage = () => {
    useEffect(() => {
        Trackify.getInstance();
    }, []);

    return <>Ahahahha</>;
};

export default TrackifyPage;
