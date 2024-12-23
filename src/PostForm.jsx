import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/Textarea";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PostForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [categories, setCategories] = useState([]);

  const createPost = (e) => {
    e.preventDefault();
    console.log(title, content, category, tags);
  };

  useEffect(() => {
    fetchCategories();
  }, []); // Add dependency array to prevent infinite loop

  const fetchCategories = async () => {
    const response = await fetch("http://localhost:3001/api/v1/categories");
    const data = await response.json();
    setCategories(data);
  };

  return (
    <>
      <form onSubmit={createPost}>
        <h1 className="text-4xl">Post creation form</h1>
        <p className="mt-2"> Please kindly, fill out these form </p>
        <Input
          type="text"
          placeholder="Title"
          className="w-1/2 mb-2"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
        <Textarea
          onChange={(e) => setContent(e.target.value)}
          value={content}
          placeholder="Type the post content in here."
          className="mt-4"
        />
        <Select onChange={(e) => setCategory(e.target.value)} value={category}>
          <SelectTrigger className="w-1/2 mt-4">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Categories</SelectLabel>
              {categories.map((c) => (
                <SelectItem value={c.id} key={c.id}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Input
          className="mt-2"
          placeholder="Separate each tag with a dash (-)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <Button className="mt-4 w-1/3">Créer</Button>
      </form>
    </>
  );
}
