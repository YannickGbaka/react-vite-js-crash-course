import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/Textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const INITIAL_FORM_STATE = {
  title: "",
  content: "",
  categories: "",
  tags: "",
};

export default function PostForm() {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      // Using computed property name syntax - [name] will be evaluated to the actual name value
      // For example, if name is "title", this becomes equivalent to { title: value }
      [name]: value,
    }));
  };

  const handleCategoryChange = (value) => {
    console.log(value);
    setFormData((prev) => ({
      ...prev,
      category: value,
    }));
  };

  const createPost = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Add your API call here
      formData.tags = formData.tags.split("-");
      formData.category = "";
      // Reset form after successful submission
      setFormData(INITIAL_FORM_STATE);
    } catch (err) {
      setError("Failed to create post. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/v1/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to load categories");
    }
  };

  const storePost = async ({ title, content, categories, tags, author }) => {
    try {
      const response = await fetch("http://localhost:3001/api/v1/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          categories,
          tags,
          author,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error("Error creating a post:", err);
      setError("Failed to create a post");
      throw err;
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error}
        <Button onClick={() => setError(null)} variant="link" className="ml-2">
          Try again
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <form onSubmit={createPost} className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Create New Post</h1>
          <p className="text-gray-500">
            Fill out the form below to create a new post.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Title
            </label>
            <Input
              id="title"
              type="text"
              placeholder="Enter post title"
              className="w-full"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium mb-1">
              Content
            </label>
            <Textarea
              id="content"
              name="content"
              placeholder="Write your post content here..."
              className="min-h-[200px]"
              value={formData.content}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium mb-1"
            >
              Category
            </label>
            <Select
              onValueChange={handleCategoryChange}
              defaultValue={formData.category}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {categories.map((c) => (
                    <SelectItem value={c._id} key={c._id}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium mb-1">
              Tags
            </label>
            <Input
              id="tags"
              name="tags"
              placeholder="Enter tags separated by dashes (e.g. javascript-react-web)"
              className="w-full"
              value={formData.tags}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            className="w-full sm:w-auto"
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create Post"}
          </Button>
        </div>
      </form>
    </div>
  );
}
