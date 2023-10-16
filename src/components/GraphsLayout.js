import React, {useContext} from "react"
import {Outlet, Link} from "react-router-dom"
import { DataContext } from "../contexts/DataContext"

function GraphsLayout() {

    const {data} = useContext(DataContext)

    return (
        <>
            <div id="projGraphLinkHead">
                {data.map((p) => (
                    <Link to={`/graphs/${p.proj}`} key={p.proj} className="projGraphLink">{p.proj}</Link>
                ))}
            </div>
            <div id="appContent">
                <Outlet />
            </div>
        </>

    )
}

export default GraphsLayout