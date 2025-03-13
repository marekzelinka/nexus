import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { format } from "date-fns";
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
import { ErrorList } from "~/components/error-list";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
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
  about: z
    .string()
    .trim()
    .max(255, "About ts too long")
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
    .optional()
    .transform((arg) => arg || null),
  twitter: z
    .string()
    .trim()
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

export const meta: Route.MetaFunction = ({ error }) => [
  { title: error ? "No contact found" : "Edit contact" },
];

export async function loader({ request, params }: Route.LoaderArgs) {
  const session = await requireAuthSession(request);

  const contact = await db.contact.findUnique({
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
      birthday: contact.birthday
        ? format(contact.birthday, "yyyy-MM-dd")
        : null,
    },
    lastResult: actionData?.result,
    constraint: getZodConstraint(EditContactSchema),
    onValidate: ({ formData }) =>
      parseWithZod(formData, { schema: EditContactSchema }),
  });

  const navigation = useNavigation();
  const isPending =
    navigation.location?.pathname ===
    href("/contacts/:contactId/edit", { contactId: params.contactId });

  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  return (
    <Form method="post" {...getFormProps(form)}>
      <div className="grid grid-cols-6 gap-6">
        <div className="col-span-4 space-y-2">
          <Label htmlFor={fields.avatar.id}>Avatar URL</Label>
          <Input type="url" name="avatar" id="avatar" />
        </div>
        <Tabs defaultValue="about" className="col-span-full">
          <TabsList>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
          </TabsList>
          <TabsContent
            value="about"
            forceMount
            className="data-[state=inactive]:hidden"
          >
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-3 space-y-2">
                    <Label htmlFor={fields.first.id}>First name</Label>
                    <Input {...getInputProps(fields.first, { type: "text" })} />
                    <ErrorList
                      id={fields.first.id}
                      errors={fields.first.errors}
                    />
                  </div>
                  <div className="col-span-3 space-y-2">
                    <Label htmlFor={fields.last.id}>Last name</Label>
                    <Input {...getInputProps(fields.last, { type: "text" })} />
                    <ErrorList
                      id={fields.last.id}
                      errors={fields.last.errors}
                    />
                  </div>
                  <div className="col-span-4 space-y-2">
                    <Label htmlFor={fields.about.id}>About</Label>
                    <Input {...getInputProps(fields.about, { type: "text" })} />
                    <ErrorList
                      id={fields.about.id}
                      errors={fields.about.errors}
                    />
                  </div>
                  <div className="col-span-3 space-y-2">
                    <Label htmlFor={fields.email.id}>Email</Label>
                    <Input
                      {...getInputProps(fields.email, { type: "email" })}
                    />
                    <ErrorList
                      id={fields.email.id}
                      errors={fields.email.errors}
                    />
                  </div>
                  <div className="col-span-3 space-y-2">
                    <Label htmlFor={fields.phone.id}>Phone</Label>
                    <Input {...getInputProps(fields.phone, { type: "tel" })} />
                    <ErrorList
                      id={fields.phone.id}
                      errors={fields.phone.errors}
                    />
                  </div>

                  <div className="col-span-3 space-y-2">
                    <Label htmlFor={fields.company.id}>Company</Label>
                    <Input
                      {...getInputProps(fields.company, { type: "text" })}
                    />
                    <ErrorList
                      id={fields.company.id}
                      errors={fields.company.errors}
                    />
                  </div>
                  <div className="col-span-3 space-y-2">
                    <Label htmlFor={fields.birthday.id}>Birthday</Label>
                    <Input
                      className="w-fit"
                      {...getInputProps(fields.birthday, { type: "date" })}
                    />
                    <ErrorList
                      id={fields.birthday.id}
                      errors={fields.birthday.errors}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent
            value="social"
            forceMount
            className="data-[state=inactive]:hidden"
          >
            <Card>
              <CardHeader>
                <CardTitle>Social</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-3 space-y-2">
                    <Label htmlFor={fields.linkedin.id}>LinkedIn</Label>
                    <Input
                      {...getInputProps(fields.linkedin, {
                        type: "text",
                        ariaDescribedBy: `${fields.linkedin.id}-description`,
                      })}
                    />
                    <p
                      id={`${fields.linkedin.id}-description`}
                      className="text-sm text-muted-foreground"
                    >
                      LinkedIn handle
                    </p>
                    <ErrorList
                      id={fields.linkedin.id}
                      errors={fields.linkedin.errors}
                    />
                  </div>
                  <div className="col-span-3 space-y-2">
                    <Label htmlFor={fields.twitter.id}>Twitter</Label>
                    <Input
                      {...getInputProps(fields.twitter, {
                        type: "text",
                        ariaDescribedBy: `${fields.twitter.id}-description`,
                      })}
                    />
                    <p
                      id={`${fields.twitter.id}-description`}
                      className="text-sm text-muted-foreground"
                    >
                      Twitter handle e.g. @jack
                    </p>
                    <ErrorList
                      id={fields.twitter.id}
                      errors={fields.twitter.errors}
                    />
                  </div>
                  <div className="col-span-4 space-y-2">
                    <Label htmlFor={fields.website.id}>Website URL</Label>
                    <Input
                      {...getInputProps(fields.website, {
                        type: "url",
                        ariaDescribedBy: `${fields.website.id}-description`,
                      })}
                    />
                    <p
                      id={`${fields.website.id}-description`}
                      className="text-sm text-muted-foreground"
                    >
                      Personal website
                    </p>
                    <ErrorList
                      id={fields.website.id}
                      errors={fields.website.errors}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <div className="col-span-full flex justify-end gap-3">
          <Button type="button" variant="ghost" size="sm" onClick={goBack}>
            Cancel
          </Button>
          <Button type="submit" size="sm" disabled={isPending}>
            {isPending ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>
    </Form>
  );
}
