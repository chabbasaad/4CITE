import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDropzone } from 'react-dropzone';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {  X, Upload, Image as ImageIcon } from 'lucide-react';
import { postSchema, PostSchemaType } from '@/services/posts/schemas';
import { useCreatePost } from '@/services/posts/mutation';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes


interface CreatePostDialogProps extends React.ComponentPropsWithoutRef<typeof Dialog> {
  showTrigger?: boolean;
  onSuccess?: () => void;
}




export function CreatePostDialog(props: CreatePostDialogProps) {
  

  const [files, setFiles] = useState<File[]>([]);

  const form = useForm<PostSchemaType>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: '',
      content: '',
      media: [],
    },
  });

  const {mutate} = useCreatePost()

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'video/*': ['.mp4', '.mov', '.avi', '.mkv'], 
    },
    maxSize: MAX_FILE_SIZE,
    onDrop: (acceptedFiles) => {
      setFiles((prev) => [...prev, ...acceptedFiles]);
      form.setValue('media', acceptedFiles);
    },
  });

  const onSubmit = (data: PostSchemaType) => {
    console.log('Form submitted:', data);
    mutate(data, {onSuccess: () => { 
      props.onSuccess?.()
    }});
  
    form.reset();
    setFiles([]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Dialog {...props}>
     
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Create New Post</DialogTitle>
        </DialogHeader>
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="space-y-6"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              {...form.register('title')}
              className="w-full"
              placeholder="Enter post title"
            />
            {form.formState.errors.title && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-red-500"
              >
                {form.formState.errors.title.message}
              </motion.p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              {...form.register('content')}
              className="min-h-[150px]"
              placeholder="Write your post content here..."
            />
            {form.formState.errors.content && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-red-500"
              >
                {form.formState.errors.content.message}
              </motion.p>
            )}
          </div>

          <div className="space-y-4">
            <Label>Media</Label>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300'
              }`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-8 h-8 text-gray-400" />
                <p className="text-sm text-gray-600">
                  Drag & drop files here, or click to select files
                </p>
                <p className="text-xs text-gray-400">
                  Maximum file size: 2MB
                </p>
              </div>
            </div>

            <AnimatePresence>
              {files.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  {files.map((file, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center gap-2 p-2 bg-gray-50 rounded"
                    >
                      <ImageIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm truncate flex-1">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => removeFile(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
            
            >
              Cancel
            </Button>
            <Button type="submit">Create Post</Button>
          </div>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
}