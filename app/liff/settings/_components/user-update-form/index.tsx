"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { industrialDivisions, industrialGroups, industrialMajorGroups } from "@/lib/user/industrial-group";
import { prefectureAreas } from "@/lib/user/prefecture-areas";
import { User } from "@/prisma/generated/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";
import { updateUser } from "./_actions/update-user";

const schema = z.object({
  companyName: z.string(),
  companyAddressPrefecture: z.string(),
  companyAddressRest: z.string(),
  industrialDivision: z.string(),
  industrialMajorGroup: z.string(),
  industrialGroup: z.string(),
  department: z.string(),
  jobTitle: z.string(),
  name: z.string(),
  phoneticName: z.string(),
  phoneNumber: z.string(),
  email: z.string(),
});

type FieldInputs = z.input<typeof schema>;
type FieldOutputs = z.output<typeof schema>;

export function UserUpdateForm({
  user,
}: {
  user: User;
}) {
  const router = useRouter();

  const [isBusy, setIsBusy] = useState(false);

  const [industrialMajorGroupSelectItemProps, setIndustrialMajorGroupSelectItemProps] = useState<{
    code: string;
    label: string;
  }[]>(industrialMajorGroups);

  const [industrialGroupSelectItemProps, setIndustrialGroupSelectItemProps] = useState<{
    code: string;
    label: string;
  }[]>(industrialGroups);

  const form = useForm<FieldInputs, unknown, FieldOutputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      companyName: user.companyName || "",
      companyAddressPrefecture: user.companyAddressPrefecture || "",
      companyAddressRest: user.companyAddressRest || "",
      industrialDivision: user.industrialDivision || "",
      industrialMajorGroup: user.industrialMajorGroup || "",
      industrialGroup: user.industrialGroup || "",
      department: user.department || "",
      jobTitle: user.jobTitle || "",
      name: user.name || "",
      phoneticName: user.phoneticName || "",
      phoneNumber: user.phoneNumber || "",
      email: user.email || "",
    },
  });

  const handleSubmit = useCallback(async (values: FieldOutputs) => {
    setIsBusy(true);

    try {
      await toast.promise(updateUser(user.id, {
        ...values,
      }), {
        loading: "保存中...",
        success: "保存しました！",
        error: "保存できませんでした、、、",
      });

      router.refresh();
    } finally {
      setIsBusy(false);
    }
  }, [user, router]);

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "industrialDivision") {
        const industrialDivision = industrialDivisions.find(({ code }) => {
          return code === value.industrialDivision;
        });

        const industrialMajorGroupSelectItemProps = industrialMajorGroups
          .filter(({ code }) => {
            if (!industrialDivision) {
              return true;
            }

            return industrialDivision.majorGroupCodes.includes(code);
          });

        setIndustrialMajorGroupSelectItemProps(industrialMajorGroupSelectItemProps);
      }

      if (name === "industrialMajorGroup") {
        const industrialMajorGroup = industrialMajorGroups.find(({ code }) => {
          return code === value.industrialMajorGroup;
        });

        const industrialGroupSelectItemProps = industrialGroups
          .filter(({ code }) => {
            if (!industrialMajorGroup) {
              return true;
            }

            return code.startsWith(industrialMajorGroup.code);
          });

        setIndustrialGroupSelectItemProps(industrialGroupSelectItemProps);
      }

    });

    return () => {
      subscription.unsubscribe();
    };
  }, [form]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>会社名</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="companyAddressPrefecture"
          render={({ field }) => (
            <FormItem>
              <FormLabel>会社住所（都道府県）</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl className="w-full">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-[50svh]">
                  {prefectureAreas.map(({ area, prefectures }) => (
                    <SelectGroup key={area}>
                      <SelectLabel>
                        {area}
                      </SelectLabel>

                      {prefectures.map((prefecture) => (
                        <SelectItem
                          key={prefecture}
                          value={prefecture}>
                          {prefecture}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="companyAddressRest"
          render={({ field }) => (
            <FormItem>
              <FormLabel>会社住所（都道府県より後ろ）</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="industrialDivision"
          render={({ field }) => (
            <FormItem>
              <FormLabel>業種（大分類）</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl className="w-full">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-[50svh]">
                  {industrialDivisions.map(({ code, label }) => (
                    <SelectItem
                      key={code}
                      value={code}>
                      {code}: {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="industrialMajorGroup"
          render={({ field }) => (
            <FormItem>
              <FormLabel>業種（中分類）</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl className="w-full">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-[50svh]">
                  {industrialMajorGroupSelectItemProps
                    .map(({ code, label }) => (
                      <SelectItem
                        key={code}
                        value={code}>
                        {code}: {label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="industrialGroup"
          render={({ field }) => (
            <FormItem>
              <FormLabel>業種（小分類）</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl className="w-full">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-[50svh]">
                  {industrialGroupSelectItemProps
                    .map(({ code, label }) => (
                      <SelectItem
                        key={code}
                        value={code}>
                        {code}: {label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel>所属、部署など</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="jobTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>役職、肩書など</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>名前</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneticName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>名前（ふりがな）</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>電話番号</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>メールアドレス</FormLabel>
              <FormControl>
                <Input {...field} />
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
