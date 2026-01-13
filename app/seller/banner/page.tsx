"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from "react";
import Image from "next/image";
import SellerPageTitle from "@/components/seller/SellerPageTitle";
import { assets } from "@/assets/assets";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "react-hot-toast";
import { LoaderIcon } from "lucide-react";

type BannerType = "CONTENT" | "RESPONSIVE_IMAGE";
type ImageFormat = "PNG" | "JPG" | "WEBP";

const BannerCreator = () => {
  const [bannerType, setBannerType] = useState<BannerType>("CONTENT");
  const [imageFormat, setImageFormat] = useState<ImageFormat>("PNG");

  // SAME PATTERN AS PRODUCT PAGE
  const [files, setFiles] = useState<(File | null)[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    offer: "",
    buttonText1: "",
    buttonText2: "",
    sortOrder: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("type", bannerType);
      formData.append("imageFormat", imageFormat);
      formData.append("title", form.title);
      formData.append("offer", form.offer);
      formData.append("buttonText1", form.buttonText1);
      formData.append("buttonText2", form.buttonText2);
      formData.append("sortOrder", String(form.sortOrder));

      // append images ONLY ON SUBMIT
      files.forEach((file) => {
        if (file) formData.append("images", file);
      });

      const res = await fetch("/api/banner/create", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to create banner");

      toast.success("Banner created");

      setFiles([]);
      setForm({
        title: "",
        offer: "",
        buttonText1: "",
        buttonText2: "",
        sortOrder: 0,
      });
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-6 py-6 min-h-screen w-full mt-16">
      <SellerPageTitle title="Create Banner" />

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col xl:flex-row gap-10 mt-6">
          {/* LEFT */}
          <div className="space-y-5 max-w-md w-full">
            <div>
              <p className="text-base font-medium">Banner Images</p>
              <div className="flex flex-wrap gap-3 mt-2">
                {[...Array(bannerType === "CONTENT" ? 1 : 3)].map((_, index) => (
                  <label key={index} htmlFor={`banner-image-${index}`}>
                    <input
                      type="file"
                      hidden
                      id={`banner-image-${index}`}
                      accept="image/*"
                      onChange={(e: any) => {
                        const updated = [...files];
                        updated[index] = e.target.files[0];
                        setFiles(updated);
                      }}
                    />
                    <Image
                      src={
                        files[index]
                          ? URL.createObjectURL(files[index]!)
                          : assets.upload_area
                      }
                      alt=""
                      width={100}
                      height={100}
                      className="max-w-24 h-24 object-cover rounded cursor-pointer"
                    />
                  </label>
                ))}
              </div>

              {bannerType === "RESPONSIVE_IMAGE" && (
                <p className="text-xs text-muted-foreground mt-1">
                  Order: Desktop • Tablet • Mobile
                </p>
              )}
            </div>

            {bannerType === "CONTENT" && (
              <>
                <Field label="Title" name="title" value={form.title} onChange={handleChange} />
                <Field label="Offer" name="offer" value={form.offer} onChange={handleChange} />
                <Field
                  label="Button Text 1"
                  name="buttonText1"
                  value={form.buttonText1}
                  onChange={handleChange}
                />
                <Field
                  label="Button Text 2"
                  name="buttonText2"
                  value={form.buttonText2}
                  onChange={handleChange}
                />
              </>
            )}
          </div>

          {/* RIGHT */}
          <div className="space-y-5 max-w-md w-full">
            <div>
              <Label className="text-base font-medium">Banner Type</Label>
              <RadioGroup
                value={bannerType}
                onValueChange={(val) => setBannerType(val as BannerType)}
                className="flex gap-6 mt-2"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="CONTENT" id="content" />
                  <Label htmlFor="content">Content</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="RESPONSIVE_IMAGE" id="responsive" />
                  <Label htmlFor="responsive">Responsive</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="text-base font-medium">Image Format</Label>
              <select
                value={imageFormat}
                onChange={(e) => setImageFormat(e.target.value as ImageFormat)}
                className="w-full border rounded px-3 py-2 mt-1"
              >
                <option value="PNG">PNG</option>
                <option value="JPG">JPG</option>
                <option value="WEBP">WEBP</option>
              </select>
            </div>

            <Field
              label="Sort Order"
              name="sortOrder"
              type="number"
              value={form.sortOrder}
              onChange={handleChange}
            />

            <Button
              type="submit"
              disabled={loading}
              className="w-full max-w-[200px]"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <LoaderIcon size={16} className="animate-spin" />
                  Creating Banner...
                </div>
              ) : (
                "Create Banner"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BannerCreator;

function Field({ label, name, value, onChange, type = "text" }: any) {
  return (
    <div className="flex flex-col gap-1">
      <Label className="text-base font-medium">{label}</Label>
      <Input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
      />
    </div>
  );
}
