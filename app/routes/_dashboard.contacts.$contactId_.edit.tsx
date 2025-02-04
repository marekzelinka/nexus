import {
  getFormProps,
  getInputProps,
  getTextareaProps,
  useForm,
} from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { format } from "date-fns";
import { data, Form, redirect, useNavigate } from "react-router";
import { z } from "zod";
import { GenericErrorBoundary } from "~/components/error-boundary";
import { ErrorList } from "~/components/forms";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import { requireUserId } from "~/lib/auth.server";
import { db } from "~/lib/db.server";
import type { Route } from "./+types/_dashboard.contacts.$contactId_.edit";

const EditContactSchema = z.object({
  first: z
    .string()
    .trim()
    .optional()
    .transform((arg) => arg || null),
  last: z
    .string()
    .trim()
    .optional()
    .transform((arg) => arg || null),
  avatar: z
    .string()
    .trim()
    .url("Avatar URL is invalid")
    .optional()
    .transform((arg) => arg || null),
  bio: z
    .string()
    .trim()
    .max(255, "Bio ts too long")
    .optional()
    .transform((arg) => arg || null),
  email: z
    .string()
    .trim()
    .email("Email is invalid")
    .min(3, "Email is too short")
    // Users can type the email in any case, but we store it in lowercase
    .transform((arg) => arg.toLowerCase())
    .optional()
    .transform((arg) => arg || null),
  phone: z
    .string()
    .trim()
    .optional()
    .transform((arg) => arg || null),
  linkedin: z
    .string()
    .trim()
    .url("LinkedIn URL is invalid")
    .optional()
    .transform((arg) => arg || null),
  social: z
    .string()
    .trim()
    .url("Social URL is invalid")
    .optional()
    .transform((arg) => arg || null),
  website: z
    .string()
    .trim()
    .url("Website URL is invalid")
    .optional()
    .transform((arg) => arg || null),
  location: z
    .string()
    .trim()
    .optional()
    .transform((arg) => arg || null),
  company: z
    .string()
    .trim()
    .optional()
    .transform((arg) => arg || null),
  birthday: z.coerce
    .date({ invalid_type_error: "Birthday is invalid" })
    .optional()
    .transform((arg) => arg?.toISOString() || null),
});

export const meta = ({ error }: Route.MetaArgs) => {
  return [{ title: error ? "No contact found" : "Edit contact" }];
};

export async function loader({ request, params }: Route.LoaderArgs) {
  const userId = await requireUserId(request);

  const contact = await db.contact.findUnique({
    select: {
      id: true,
      first: true,
      last: true,
      avatar: true,
      bio: true,
      email: true,
      phone: true,
      linkedin: true,
      social: true,
      website: true,
      location: true,
      company: true,
      birthday: true,
    },
    where: { id: params.contactId, userId },
  });
  if (!contact) {
    throw data(`No contact with the id "${params.contactId}" exists.`, {
      status: 404,
    });
  }

  return { contact };
}

export async function action({ request, params }: Route.ActionArgs) {
  const userId = await requireUserId(request);

  const contact = await db.contact.findUnique({
    select: { id: true },
    where: { id: params.contactId, userId },
  });
  if (!contact) {
    throw data(`No contact with the id "${params.contactId}" exists.`, {
      status: 404,
    });
  }

  const formData = await request.formData();

  const submission = parseWithZod(formData, { schema: EditContactSchema });
  if (submission.status !== "success") {
    return data(
      { result: submission.reply() },
      { status: submission.status === "error" ? 400 : 200 },
    );
  }

  const updates = submission.value;
  await db.contact.update({
    select: { id: true },
    data: updates,
    where: { id: params.contactId, userId },
  });

  throw redirect(`/contacts/${params.contactId}`);
}

export function ErrorBoundary() {
  return (
    <div className="mx-auto max-w-3xl">
      <GenericErrorBoundary />
    </div>
  );
}

export default function Component({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { contact } = loaderData;

  const [form, fields] = useForm({
    defaultValue: {
      ...contact,
      birthday: contact.birthday
        ? format(contact.birthday, "yyyy-MM-dd")
        : null,
    },
    constraint: getZodConstraint(EditContactSchema),
    lastResult: actionData?.result,
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate: ({ formData }) =>
      parseWithZod(formData, { schema: EditContactSchema }),
  });

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="sr-only">Edit Contact</h1>
      <Form method="POST" {...getFormProps(form)}>
        <div className="grid gap-4">
          <div className="grid grid-cols-3 items-start gap-4">
            <Label htmlFor={fields.avatar.id} className="pt-3">
              Avatar URL
            </Label>
            <div className="col-span-2">
              <Input
                className="bg-background"
                {...getInputProps(fields.avatar, { type: "url" })}
              />
              <ErrorList
                id={fields.avatar.errorId}
                errors={fields.avatar.errors}
                className="mt-2"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 items-start gap-4">
            <Label htmlFor={fields.first.id} className="pt-3">
              First name
            </Label>
            <div className="col-span-2">
              <Input
                className="bg-background max-w-xs"
                {...getInputProps(fields.first, { type: "text" })}
              />
              <ErrorList
                id={fields.first.errorId}
                errors={fields.first.errors}
                className="mt-2"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 items-start gap-4">
            <Label htmlFor={fields.last.id} className="pt-3">
              Last name
            </Label>
            <div className="col-span-2">
              <Input
                className="bg-background max-w-xs"
                {...getInputProps(fields.last, { type: "text" })}
              />
              <ErrorList
                id={fields.last.errorId}
                errors={fields.last.errors}
                className="mt-2"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 items-start gap-4">
            <Label htmlFor={fields.bio.id} className="pt-3">
              Bio
            </Label>
            <div className="col-span-2">
              <Textarea
                rows={4}
                className="bg-background"
                {...getTextareaProps(fields.bio)}
              />
              <ErrorList
                id={fields.bio.errorId}
                errors={fields.bio.errors}
                className="mt-2"
              />
            </div>
          </div>
        </div>
        <Separator className="my-6" />
        <div className="grid gap-4">
          <div className="grid grid-cols-3 items-start gap-4">
            <Label htmlFor={fields.email.id} className="pt-3">
              Email
            </Label>
            <div className="col-span-2">
              <Input
                className="bg-background max-w-xs"
                {...getInputProps(fields.email, { type: "email" })}
              />
              <ErrorList
                id={fields.email.errorId}
                errors={fields.email.errors}
                className="mt-2"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 items-start gap-4">
            <Label htmlFor={fields.phone.id} className="pt-3">
              Phone
            </Label>
            <div className="col-span-2">
              <Input
                className="bg-background max-w-xs"
                {...getInputProps(fields.phone, { type: "tel" })}
              />
              <ErrorList
                id={fields.phone.errorId}
                errors={fields.phone.errors}
                className="mt-2"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 items-start gap-4">
            <Label htmlFor={fields.linkedin.id} className="pt-3">
              LinkedIn
            </Label>
            <div className="col-span-2">
              <Input
                className="bg-background max-w-xs"
                {...getInputProps(fields.linkedin, { type: "url" })}
              />
              <ErrorList
                id={fields.linkedin.errorId}
                errors={fields.linkedin.errors}
                className="mt-2"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 items-start gap-4">
            <Label htmlFor={fields.social.id} className="pt-3">
              Social URL
            </Label>
            <div className="col-span-2">
              <Input
                className="bg-background max-w-xs"
                {...getInputProps(fields.social, { type: "url" })}
              />
              <ErrorList
                id={fields.social.errorId}
                errors={fields.social.errors}
                className="mt-2"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 items-start gap-4">
            <Label htmlFor={fields.website.id} className="pt-3">
              Website URL
            </Label>
            <div className="col-span-2">
              <Input
                className="bg-background max-w-xs"
                {...getInputProps(fields.website, { type: "url" })}
              />
              <ErrorList
                id={fields.website.errorId}
                errors={fields.website.errors}
                className="mt-2"
              />
            </div>
          </div>
        </div>
        <Separator className="my-6" />
        <div className="grid gap-4">
          <div className="grid grid-cols-3 items-start gap-4">
            <Label htmlFor={fields.location.id} className="pt-3">
              Location
            </Label>
            <div className="col-span-2">
              <Input
                className="bg-background max-w-sm"
                {...getInputProps(fields.location, { type: "text" })}
              />
              <ErrorList
                id={fields.location.errorId}
                errors={fields.location.errors}
                className="mt-2"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 items-start gap-4">
            <Label htmlFor={fields.company.id} className="pt-3">
              Company
            </Label>
            <div className="col-span-2">
              <Input
                className="bg-background max-w-xs"
                {...getInputProps(fields.company, { type: "text" })}
              />
              <ErrorList
                id={fields.company.errorId}
                errors={fields.company.errors}
                className="mt-2"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 items-start gap-4">
            <Label htmlFor={fields.birthday.id} className="pt-3">
              Birthday
            </Label>
            <div className="col-span-2">
              <Input
                className="bg-background max-w-fit"
                {...getInputProps(fields.birthday, { type: "date" })}
              />
              <ErrorList
                id={fields.birthday.errorId}
                errors={fields.birthday.errors}
                className="mt-2"
              />
            </div>
          </div>
        </div>
        <Separator className="my-6" />
        <div className="grid grid-cols-3 items-start gap-3">
          <div className="col-span-2 col-start-2">
            <ErrorList
              id={form.errorId}
              errors={form.errors}
              className="mb-2"
            />
            <div className="flex gap-2">
              <Button type="submit">Save</Button>
              <CancelButton />
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
}

function CancelButton() {
  const navigate = useNavigate();

  return (
    <Button type="button" variant="outline" onClick={() => navigate(-1)}>
      Cancel
    </Button>
  );
}
