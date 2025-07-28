"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, useCallback, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";
import { createUserProfileNote } from "./_actions/create-user-profile-note";
import { uploadImage } from "./_actions/upload-image";

const schema = z.object({
  body: z.string().min(1),
  images: z.array(z.object({
    uri: z.string(),
  })),
});

type FieldInputs = z.input<typeof schema>;
type FieldOutputs = z.output<typeof schema>;

export function UserProfileNoteCreateForm({
  userProfileId,
}: {
  userProfileId: string;
}) {
  const router = useRouter();

  const [isBusy, setIsBusy] = useState(false);

  const form = useForm<FieldInputs, unknown, FieldOutputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      body: "",
      images: [],
    },
  });

  const imageFieldArray = useFieldArray({
    control: form.control,
    name: "images",
  });

  const handleSubmit = useCallback(async (values: FieldOutputs) => {
    setIsBusy(true);

    try {
      await toast.promise(createUserProfileNote({
        userProfileId,
        ...values,
      }), {
        loading: "保存中...",
        success: "保存しました！",
        error: "保存できませんでした、、、",
      });

      form.reset();

      router.refresh();
    } finally {
      setIsBusy(false);
    }
  }, [userProfileId, form, router]);

  const handleImageDataFieldChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const files = event.currentTarget.files;

    if (!files) {
      return;
    }

    for (const file of files) {
      const fileReader = new FileReader();

      fileReader.onload = async () => {
        const imageUri = await uploadImage({
          imageData: z.string().parse(fileReader.result),
        });

        imageFieldArray.append({
          uri: imageUri,
        });
      };

      fileReader.readAsDataURL(file);
    }
  }, [imageFieldArray]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-2">
        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-wrap gap-2">
          {imageFieldArray.fields.map((field, fieldIndex) => (
            <AlertDialog key={field.id}>
              <AlertDialogTrigger asChild>
                <div className="w-8 aspect-square rounded-lg bg-gray-400 overflow-hidden">
                  <Image
                    src={field.uri}
                    alt="image"
                    width={512}
                    height={512}
                    className="h-full w-full object-cover" />
                </div>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    選択された画像
                  </AlertDialogTitle>
                </AlertDialogHeader>
                <div className="rounded-lg bg-gray-400 overflow-hidden">
                  <Image
                    src={field.uri}
                    alt="image"
                    width={512}
                    height={512}
                    className="h-full w-full object-cover" />
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>
                    閉じる
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive"
                    onClick={() => {
                      imageFieldArray.remove(fieldIndex);
                    }}>
                    この画像の選択を解除する
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="outline">
            <label className="flex justify-center items-center !rounded-full">
              <input
                type="file"
                multiple={true}
                accept="image/jpeg,image/png"
                onChange={handleImageDataFieldChange}
                className="hidden" />
              <ImageIcon />
            </label>
          </Button>

          <Button
            disabled={isBusy}
            className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg text-white font-bold">
            保存する
          </Button>
        </div>
      </form>
    </Form>
  );
}
