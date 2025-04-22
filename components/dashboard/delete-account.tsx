"use client";

import { useDeleteAccountModal } from "@/components/modals/delete-account-modal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { siteConfig } from "@/config/site";

export function DeleteAccountSection() {
  const { setShowDeleteAccountModal, DeleteAccountModal } =
    useDeleteAccountModal();

  return (
    <>
      <DeleteAccountModal />
      <Card className="border border-red-600">
        <CardHeader className="space-y-2">
          <CardTitle>Excluir conta</CardTitle>
          <CardDescription className="text-pretty text-[15px] lg:text-balance">
          Exclua permanentemente seu {siteConfig.name} conta e seu
            inscrição. Esta ação não pode ser desfeita - prossiga com
            Cuidado.
          </CardDescription>
        </CardHeader>
        <CardFooter className="mt-2 flex justify-end border-t border-red-600 bg-red-500/5 py-2">
          <Button
            type="submit"
            variant="destructive"
            onClick={() => setShowDeleteAccountModal(true)}
          >
            <span>Excluir conta</span>
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
