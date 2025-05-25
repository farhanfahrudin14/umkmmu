interface GoogleMapProps {
  latitude: number
  longitude: number
}

export default function GoogleMap({ latitude, longitude }: GoogleMapProps) {
  const embedUrl = `https://www.google.com/maps/embed/v1/place?q=${latitude},${longitude}&zoom=15&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8`

  return (
    <div className="w-full h-96">
      <iframe width="100%" height="100%" style={{ border: 0 }} loading="lazy" src={embedUrl} allowFullScreen></iframe>
    </div>
  )
}

