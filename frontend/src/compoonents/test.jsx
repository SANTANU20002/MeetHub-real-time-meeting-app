import React, { useState } from "react";

function Counter() {
  // Declare a state variable named "count" with an initial value of 0
  const [count, setCount] = useState(0);

  // Function to increase the count
  const increment = () => {
    setCount(count + 1);
  };

  // Function to decrease the count
  const decrement = () => {
    setCount(count - 1);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>React useState Example</h2>
      <h3>Count: {count}</h3>
      <button onClick={decrement} style={{ marginRight: "10px" }}>-</button>
      <button onClick={increment}>+</button>
    </div>
  );
}

export default Counter;
