import React from "react";


function User ({match}) {
  return <div>
    <h3>{match.params.username}</h3>
    {match.params.repo}
  </div>
}

export default User;