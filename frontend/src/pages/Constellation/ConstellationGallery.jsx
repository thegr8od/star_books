import { useContext } from 'react';
import { ConstellationContext } from './Constellation';
import ConstellationGalleryBox from "./ConstellationGalleryBox.jsx";

function ConstellationGallery() {
    const { galleryData } = useContext(ConstellationContext);

    return (
        <div className="flex flex-col space-y-4 px-4 py-2">
            {galleryData.map((monthData) => (
                <ConstellationGalleryBox 
                    key={monthData.month}
                    month={monthData.month}
                    constellationData={monthData.xy}
                    className="w-full"
                />
            ))}
        </div>
    );
}

export default ConstellationGallery;