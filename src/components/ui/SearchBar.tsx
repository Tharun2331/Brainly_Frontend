import React, {useState} from "react";
import { Input } from "./Input";

export default function SearchBar () {
  const [value,setValue] = useState();
    return (
      <div className="">
        <Input 
        type="text" 
        value={value}
        onChange={() => setValue(value)}
        placeholder="Search..."
        required={true}
        />
      </div>
    )
}