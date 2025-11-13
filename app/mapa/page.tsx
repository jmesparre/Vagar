import { fetchProperties } from '@/lib/data';
import MapContainer from '@/components/custom/MapContainer';

const MapPage = async () => {
  const properties = await fetchProperties();

  return <MapContainer properties={properties} />;
};

export default MapPage;
