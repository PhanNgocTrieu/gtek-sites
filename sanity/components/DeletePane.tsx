import React from "react";
import { Card, Stack, Text, Button, Dialog, Flex, Box } from "@sanity/ui";
import { useDocumentOperation } from "sanity";

export default function DeletePane(props: any) {
  const documentId: string | undefined = props?.documentId;
  const schemaType: string | undefined = props?.schemaType;
  const { delete: deleteOperation } = useDocumentOperation(documentId ?? "", schemaType ?? "");
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const isDeleteDisabled = !documentId || !schemaType || Boolean(deleteOperation.disabled);

  const onConfirmDelete = () => {
    if (!documentId || !schemaType) return;
    deleteOperation.execute();
    setIsDialogOpen(false);
  };

  return (
    <>
      <Card padding={4}>
        <Stack space={4}>
          <Text size={2} weight="semibold">
            Delete document
          </Text>
          <Text size={1} muted>
            This action permanently removes the current document.
          </Text>
          <Button
            tone="critical"
            text="Delete now"
            onClick={() => setIsDialogOpen(true)}
            disabled={isDeleteDisabled}
          />
        </Stack>
      </Card>

      {isDialogOpen ? (
        <Dialog
          id="confirm-delete-document"
          header="Confirm delete"
          onClose={() => setIsDialogOpen(false)}
          width={1}
        >
          <Box padding={4}>
            <Stack space={4}>
              <Text size={1}>This will permanently delete this document and cannot be undone.</Text>
              <Flex gap={3} justify="flex-end">
                <Button text="Cancel" mode="ghost" onClick={() => setIsDialogOpen(false)} />
                <Button tone="critical" text="Delete permanently" onClick={onConfirmDelete} disabled={isDeleteDisabled} />
              </Flex>
            </Stack>
          </Box>
        </Dialog>
      ) : null}
    </>
  );
}

