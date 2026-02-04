"use client";

import Link from "next/link";
import { FileText, Download, PenTool, CheckCircle, Clock } from "lucide-react";
import { Button } from "@shared/ui/button";
import { Badge } from "@shared/ui/badge";
import { Card, CardContent } from "@shared/ui/card";
import { useDocumentsPage } from "../lib/useDocumentsPage";
import type { DocumentsPageProps } from "../model/interface";

export function DocumentsPage(props: DocumentsPageProps) {
  const {
    t,
    hasDocuments,
    downloadingId,
    handleDownload,
    handleSign,
    getStatusLabel,
    getStatusVariant,
    formatDate,
    getOrderLink,
  } = useDocumentsPage(props);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FileText className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          {hasDocuments && (
            <p className="text-sm text-muted-foreground">
              {t("itemsCount", { count: props.documents.length })}
            </p>
          )}
        </div>
      </div>

      {!hasDocuments ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <FileText className="mb-4 h-16 w-16 text-muted-foreground" />
            <h2 className="mb-2 text-xl font-semibold">{t("emptyTitle")}</h2>
            <p className="text-muted-foreground">{t("emptyDescription")}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Desktop Table */}
          <div className="hidden overflow-hidden rounded-lg border md:block">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">
                    {t("table.order")}
                  </th>
                  <th className="px-4 py-3 text-left font-medium">
                    {t("table.type")}
                  </th>
                  <th className="px-4 py-3 text-left font-medium">
                    {t("table.role")}
                  </th>
                  <th className="px-4 py-3 text-left font-medium">
                    {t("table.status")}
                  </th>
                  <th className="px-4 py-3 text-left font-medium">
                    {t("table.date")}
                  </th>
                  <th className="px-4 py-3 text-center font-medium">
                    {t("table.actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {props.documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-muted/25">
                    <td className="px-4 py-4">
                      <Link
                        href={getOrderLink(doc)}
                        className="font-medium text-primary hover:underline"
                      >
                        #{doc.order_id}
                      </Link>
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">
                      {t("type.rentalContract")}
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant="outline">
                        {doc.userRole === "owner" ? t("role.owner") : t("role.renter")}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      <Badge
                        variant={getStatusVariant(doc.status)}
                        className={
                          doc.status === "signed"
                            ? "text-green-600 border-green-300"
                            : doc.status === "partially_signed"
                            ? "text-amber-600 border-amber-300"
                            : ""
                        }
                      >
                        {doc.status === "signed" && (
                          <CheckCircle className="mr-1 h-3 w-3" />
                        )}
                        {doc.status === "partially_signed" && (
                          <Clock className="mr-1 h-3 w-3" />
                        )}
                        {getStatusLabel(doc.status)}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">
                      {formatDate(doc.created_at)}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {doc.needsUserSignature && (
                          <Button
                            size="sm"
                            onClick={() => handleSign(doc)}
                          >
                            <PenTool className="mr-1 h-3 w-3" />
                            {t("actions.sign")}
                          </Button>
                        )}
                        {doc.status === "signed" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownload(doc)}
                            disabled={downloadingId === doc.id}
                          >
                            <Download className="mr-1 h-3 w-3" />
                            {t("actions.download")}
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="space-y-4 md:hidden">
            {props.documents.map((doc) => (
              <Card key={doc.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <Link
                        href={getOrderLink(doc)}
                        className="font-medium text-primary hover:underline"
                      >
                        #{doc.order_id}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {t("type.rentalContract")}
                      </p>
                    </div>
                    <Badge
                      variant={getStatusVariant(doc.status)}
                      className={
                        doc.status === "signed"
                          ? "text-green-600 border-green-300"
                          : doc.status === "partially_signed"
                          ? "text-amber-600 border-amber-300"
                          : ""
                      }
                    >
                      {doc.status === "signed" && (
                        <CheckCircle className="mr-1 h-3 w-3" />
                      )}
                      {doc.status === "partially_signed" && (
                        <Clock className="mr-1 h-3 w-3" />
                      )}
                      {getStatusLabel(doc.status)}
                    </Badge>
                  </div>

                  <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                    <span>
                      {doc.userRole === "owner" ? t("role.owner") : t("role.renter")}
                    </span>
                    <span>{formatDate(doc.created_at)}</span>
                  </div>

                  <div className="mt-4 flex gap-2">
                    {doc.needsUserSignature && (
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => handleSign(doc)}
                      >
                        <PenTool className="mr-1 h-3 w-3" />
                        {t("actions.sign")}
                      </Button>
                    )}
                    {doc.status === "signed" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleDownload(doc)}
                        disabled={downloadingId === doc.id}
                      >
                        <Download className="mr-1 h-3 w-3" />
                        {t("actions.download")}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
