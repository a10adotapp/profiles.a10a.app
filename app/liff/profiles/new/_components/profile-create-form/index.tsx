"use client";

import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCard, IdCard } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";
import { createProfile } from "./_actions/create-profile";
import { uploadImage } from "./_actions/upload-image";

const schema = z.object({
  frontImageUri: z.string().min(1),
  backImageUri: z.string().min(1),
});

type FieldInputs = z.input<typeof schema>;
type FieldOutputs = z.output<typeof schema>;

export function ProfileCreateForm() {
  const router = useRouter();

  const [isBusy, setIsBusy] = useState(false);

  const form = useForm<FieldInputs, unknown, FieldOutputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      frontImageUri: "",
      backImageUri: "",
    },
  });

  const handleSubmit = useCallback(async (values: FieldOutputs) => {
    setIsBusy(true);

    try {
      const profile = await toast.promise(createProfile({
        ...values,
      }), {
        loading: "保存中...",
        success: "保存しました！",
        error: "保存できませんでした、、、",
      });

      router.push(`/liff/profiles/${profile.id}`);
    } finally {
      setIsBusy(false);
    }
  }, [router]);

  const handleFrontImageDataFieldChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.item(0);

    if (!file) {
      return;
    }

    const fileReader = new FileReader();

    fileReader.onload = async () => {
      const frontImageUri = await uploadImage({
        imageData: z.string().parse(fileReader.result),
      });

      form.setValue("frontImageUri", frontImageUri);
    };

    fileReader.readAsDataURL(file);
  }, [form]);

  const handleBackImageDataFieldChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.item(0);

    if (!file) {
      return;
    }

    const fileReader = new FileReader();

    fileReader.onload = async () => {
      const backImageUri = await uploadImage({
        imageData: z.string().parse(fileReader.result),
      });

      form.setValue("backImageUri", backImageUri);
    };

    fileReader.readAsDataURL(file);
  }, [form]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="frontImageUri"
          render={({ field }) => (
            <FormItem>
              <FormLabel>表面</FormLabel>
              <label
                className="flex justify-center items-center w-full aspect-video rounded-lg bg-gray-400 overflow-hidden">
                <input
                  type="file"
                  multiple={false}
                  accept="image/jpeg,image/png"
                  onChange={handleFrontImageDataFieldChange}
                  className="hidden" />
                {field.value ? (
                  <Image
                    src={field.value}
                    alt="frontImage"
                    width={512}
                    height={512}
                    className="h-full w-full object-contain" />
                ) : (
                  <div className="flex items-center gap-2 p-4 bg-gray-200 rounded-full">
                    <IdCard size={48} />

                    名刺の表面を<br />選択してください
                  </div>
                )}
              </label>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="backImageUri"
          render={({ field }) => (
            <FormItem>
              <FormLabel>裏面</FormLabel>
              <label
                className="flex justify-center items-center w-full aspect-video rounded-lg bg-gray-400 overflow-hidden">
                <input
                  type="file"
                  multiple={false}
                  accept="image/jpeg,image/png"
                  onChange={handleBackImageDataFieldChange}
                  className="hidden" />
                {field.value ? (
                  <Image
                    src={field.value}
                    alt="backImage"
                    width={512}
                    height={512}
                    className="h-full w-full object-contain" />
                ) : (
                  <div className="flex items-center gap-2 p-4 bg-gray-200 rounded-full">
                    <CreditCard size={48} />

                    名刺の裏面を<br />選択してください
                  </div>
                )}
              </label>
              <FormMessage />
            </FormItem>
          )}
        />

        <hr />

        <Button
          disabled={isBusy}>
          新しい名刺を登録する
        </Button>
      </form>
    </Form>
  );
}
