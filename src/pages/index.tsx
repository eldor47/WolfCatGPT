import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";

interface MessageResponse {
  message: string;
}

interface RequestBody {
  id1: string;
  id2: string;
}

const Home: NextPage = () => {
  const [id1, setId1] = useState<number>(0);
  const [id2, setId2] = useState<number>(0);
  const [message, setMessage] = useState('Welcome to WolfCatGPT. To get started enter your cat and wolf ID, then press submit to generate a short story about them battling! This may take up to 15 seconds to load :)');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    const requestBody = {
      id1: id1.toString(),
      id2: id2.toString()
    };

    setIsLoading(true)

    fetch(`/api/data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
      .then(res => res.json())
      .then((data: MessageResponse) => {setMessage(data.message); setIsLoading(false)})
      .catch(error => console.error(error));
  };

  return (
    <div className="flex flex-col justify-center items-center py-10 overflow-auto">
      <div className="bg-white p-8 rounded-md shadow-md">
        <div className="flex flex-col space-y-4">
          <h2 className="text-3xl font-bold text-gray-800 my-6" >WolfCatGPT</h2>
          <label htmlFor="id1" className="text-gray-800 font-bold">
            Cool Cat ID:
          </label>
          <input
            type="number"
            id="id1"
            value={id1}
            onChange={e => setId1(parseInt(e.target.value))}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <label htmlFor="id2" className="text-gray-800 font-bold">
            Shadow Wolf ID:
          </label>
          <input
            type="number"
            id="id2"
            value={id2}
            onChange={e => setId2(parseInt(e.target.value))}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Submit
          </button>
              <div className="bg-white p-8 rounded-md shadow-md">
                <div className="flex justify-center items-center flex-wrap">
                  <p className="text-xl font-extralight text-gray-800">{message}</p>
                  {isLoading ?                   
                  <div className="flex justify-center items-center my-2">
                    <div className="lds-hourglass"></div>
                  </div> : <></>}
                </div>
                <div className="flex justify-around mt-8">
              <img
                  src={`https://s3.amazonaws.com/metadata.coolcatsnft.com/cat/image/${id1}.png`}
                  alt="Image 1"
                  className=" md: md:ml-0 h-32 w-32 md:h-64 md:w-64 object-contain"
                />
                <p>VS.</p>
                <img
                  src={`https://s3.amazonaws.com/metadata.coolcatsnft.com/library/wolf/image/${id2}.png`}
                  alt="Image 2"
                  className=" md: md:ml-0 h-32 w-32 md:h-64 md:w-64 object-contain"
                />
              </div>
              </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
