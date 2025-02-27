import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import {
  data,
  Form,
  href,
  redirect,
  useNavigate,
  useNavigation,
} from "react-router";
import { z } from "zod";
import { GenericErrorBoundary } from "~/components/error-boundary";
import { ErrorList } from "~/components/forms";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { db } from "~/lib/db.server";
import { requireAuthSession } from "~/lib/session.server";
import type { Route } from "./+types/edit-contact";

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
  twitter: z
    .string()
    .trim()
    .url("Twitter URL is invalid")
    .optional()
    .transform((arg) => arg || null),
});

export const meta: Route.MetaFunction = ({ error }) => [
  { title: error ? "No contact found" : "Edit contact" },
];

export async function loader({ request, params }: Route.LoaderArgs) {
  const session = await requireAuthSession(request);

  const contact = await db.contact.findUnique({
    select: { first: true, last: true, avatar: true, twitter: true },
    where: { id: params.contactId, userId: session.user.id },
  });
  if (!contact) {
    throw data(`No user with the username "${params.contactId}" exists`, {
      status: 404,
    });
  }

  return { contact };
}

export async function action({ request, params }: Route.ActionArgs) {
  const session = await requireAuthSession(request);

  const contact = await db.contact.findUnique({
    select: { id: true },
    where: { id: params.contactId, userId: session.user.id },
  });
  if (!contact) {
    throw data(`No user with the username "${params.contactId}" exists`, {
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
    where: { id: params.contactId, userId: session.user.id },
  });

  throw redirect(`/contacts/${params.contactId}`);
}

export function ErrorBoundary() {
  return <GenericErrorBoundary />;
}

export default function EditContact({
  loaderData,
  actionData,
  params,
}: Route.ComponentProps) {
  const { contact } = loaderData;

  const [form, fields] = useForm({
    defaultValue: {
      ...contact,
    },
    lastResult: actionData?.result,
    constraint: getZodConstraint(EditContactSchema),
    onValidate: ({ formData }) =>
      parseWithZod(formData, { schema: EditContactSchema }),
  });

  const navigation = useNavigation();
  const loading =
    navigation.location?.pathname ===
    href("/contacts/:contactId/edit", { contactId: params.contactId });

  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  return (
    <Form method="post" {...getFormProps(form)}>
      <div className="grid grid-cols-6 gap-6">
        <div className="col-span-4 grid gap-2">
          <Label htmlFor={fields.avatar.id}>Avatar URL</Label>
          <Input type="url" name="avatar" id="avatar" />
        </div>
        <Tabs defaultValue="profile" className="col-span-full gap-6">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
          </TabsList>
          <TabsContent
            value="profile"
            forceMount
            className="data-[state=inactive]:hidden"
          >
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-3 grid gap-2">
                <Label htmlFor={fields.first.id}>First name</Label>
                <Input {...getInputProps(fields.first, { type: "text" })} />
                <ErrorList id={fields.first.id} errors={fields.first.errors} />
              </div>
              <div className="col-span-3 grid gap-2">
                <Label htmlFor={fields.last.id}>Last name</Label>
                <Input {...getInputProps(fields.last, { type: "text" })} />
                <ErrorList id={fields.last.id} errors={fields.last.errors} />
              </div>
            </div>
          </TabsContent>
          <TabsContent
            value="social"
            forceMount
            className="data-[state=inactive]:hidden"
          >
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-4 grid gap-2">
                <Label htmlFor={fields.twitter.id}>Twitter</Label>
                <Input {...getInputProps(fields.twitter, { type: "url" })} />
                <ErrorList
                  id={fields.twitter.id}
                  errors={fields.twitter.errors}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
        <div className="col-span-full flex justify-end gap-3 border-t pt-4">
          <Button type="button" variant="ghost" size="sm" onClick={goBack}>
            Cancel
          </Button>
          <Button type="submit" size="sm" disabled={loading}>
            {loading ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>
    </Form>
  );
}
