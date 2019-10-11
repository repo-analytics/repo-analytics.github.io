import React from "react"
import ContentLoader from "react-content-loader"

const MyLoader = () => (
  <ContentLoader 
    height={220}
    width={900}
    speed={2}
    primaryColor="#f3f3f3"
    secondaryColor="#d6d6d6"
  >
    <rect x="9" y="19" rx="0" ry="0" width="432" height="179" /> 
    <rect x="460" y="19" rx="0" ry="0" width="426" height="179" /> 
    <rect x="494" y="24" rx="0" ry="0" width="0" height="13" /> 
    <rect x="394" y="85" rx="0" ry="0" width="0" height="0" />
  </ContentLoader>
)

export default MyLoader;