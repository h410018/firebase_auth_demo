import { useParams } from "react-router-dom"

export default function Aboutid() {
    let params = useParams()
    return (
        <div>
            about id: {params.id}
        </div>
    )
}