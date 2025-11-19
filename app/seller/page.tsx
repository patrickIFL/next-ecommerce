'use client'
import React, { useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { CldUploadWidget, CloudinaryUploadWidgetInfo } from 'next-cloudinary';

const AddProduct = () => {

  const [files, setFiles] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Earphone');
  const [price, setPrice] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  // since you can give 4 pictures, initialize the state with 4 null values
  const [mediaUrl, setMediaUrl] = useState([null, null, null, null]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  const handleUpload = (result, index) => {
    if (result?.info?.secure_url) {
      const updated = [...files];
      updated[index] = result.info.secure_url;
      setFiles(updated);
    }
  };

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between ">
      <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-lg">
        <div>
          <p className="text-base font-medium">Product Image</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">

       {[...Array(4)].map((_, index) => (
  <CldUploadWidget
  key={index}
  signatureEndpoint="/api/sign-image"
  onSuccess={(result, { widget }) => {
    const url = (result.info as CloudinaryUploadWidgetInfo).secure_url;

    setMediaUrl(prev => {
      const updated = [...prev];
      updated[index] = url;
      console.log(updated); // correct new array
      return updated;
    });

    widget.close();
  }}
>

    {({ open }) => (
      <div
        onClick={() => open()}
        className="overflow-hidden cursor-pointer w-24 h-24 border rounded flex items-center justify-center bg-gray-100"
      >
        <Image
  src={mediaUrl[index] ? mediaUrl[index] : assets.upload_area}
  alt=""
  width={100}
  height={100}
  className="object-cover rounded"
/>

      </div>
    )}
  </CldUploadWidget>
))}


          </div>
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="product-name">
            Product Name
          </label>
          <input
            id="product-name"
            type="text"
            placeholder="Type here"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
          />
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label
            className="text-base font-medium"
            htmlFor="product-description"
          >
            Product Description
          </label>
          <textarea
            id="product-description"
            rows={4}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="Type here"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            required
          ></textarea>
        </div>
        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setCategory(e.target.value)}
              defaultValue={category}
            >
              <option value="Earphone">Earphone</option>
              <option value="Headphone">Headphone</option>
              <option value="Watch">Watch</option>
              <option value="Smartphone">Smartphone</option>
              <option value="Laptop">Laptop</option>
              <option value="Camera">Camera</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="product-price">
              Product Price
            </label>
            <input
              id="product-price"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              required
            />
          </div>
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="offer-price">
              Offer Price
            </label>
            <input
              id="offer-price"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setOfferPrice(e.target.value)}
              value={offerPrice}
              required
            />
          </div>
        </div>
        <button type="submit" className="px-8 py-2.5 bg-orange-600 text-white font-medium rounded">
          ADD
        </button>
      </form>
      {/* <Footer /> */}
    </div>
  );
};

export default AddProduct;