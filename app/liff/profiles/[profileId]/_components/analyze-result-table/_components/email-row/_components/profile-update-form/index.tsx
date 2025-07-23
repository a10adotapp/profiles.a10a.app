"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Profile } from "@/prisma/generated/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";
import { updateProfile } from "./_actions/update-profile";

const schema = z.object({
  email: z.string(),
});

type FieldInputs = z.input<typeof schema>;
type FieldOutputs = z.output<typeof schema>;

export function ProfileUpdateForm({
  profile,
  onUpdated,
}: {
  profile: Profile;
  onUpdated: () => void;
}) {
  const router = useRouter();

  const [isBusy, setIsBusy] = useState(false);

  const form = useForm<FieldInputs, unknown, FieldOutputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: profile.email || "",
    },
  });

  const handleSubmit = useCallback(async (values: FieldOutputs) => {
    setIsBusy(true);

    try {
      await toast.promise(updateProfile(profile.id, {
        ...values,
      }), {
        loading: "保存中...",
        success: "保存しました！",
        error: "保存できませんでした、、、",
      });

      router.refresh();

      onUpdated();
    } finally {
      setIsBusy(false);
    }
  }, [onUpdated, profile, router]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <hr />

        <Button
          disabled={isBusy}>
          保存する
        </Button>
      </form>
    </Form>
  );
}
