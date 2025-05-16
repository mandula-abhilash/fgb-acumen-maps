"use client";

import { format } from "date-fns";
import {
  Building2,
  Calendar,
  ExternalLink,
  FileText,
  Globe2,
  Home,
  MapPin,
  ScrollText,
  Store,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

import { ActionButtons } from "../sites/details/sections/action-buttons";

export function OpportunityDetails({ opportunity }) {
  if (!opportunity) return null;

  const formatDate = (date) => {
    if (!date) return null;
    return format(new Date(date), "dd MMM yyyy");
  };

  const renderDateRow = (label, date) => {
    if (!date) return null;
    return (
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-sm font-medium">{formatDate(date)}</span>
      </div>
    );
  };

  const renderDocumentLink = (url, label) => {
    if (!url) return null;
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
      >
        {label}
        <ExternalLink className="h-4 w-4" />
      </a>
    );
  };

  return (
    <div className="flex flex-col h-full border-l shadow-lg">
      {/* Header Section - Fixed */}
      <div className="flex flex-col space-y-1 p-3 bg-muted/30 border-b">
        <h2 className="text-lg font-bold text-havelock-blue">
          {opportunity.site_name}
        </h2>
        <div className="flex items-center text-muted-foreground">
          <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
          <span className="text-sm">
            {opportunity.custom_site_address || opportunity.site_address}
          </span>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Image Section */}
        <div className="relative w-full h-[200px] border-b">
          <img
            src={opportunity.site_plan_image || "/assets/application.png"}
            alt={opportunity.site_name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Details Section */}
        <div className="p-3 space-y-4">
          {/* Key Details */}
          <Card className="overflow-hidden border border-havelock-blue/20">
            <div className="grid grid-cols-2 divide-x">
              <div className="p-2 space-y-0.5 bg-havelock-blue/5">
                <span className="text-sm text-muted-foreground">Plots</span>
                <p className="text-lg font-bold text-havelock-blue">
                  {opportunity.plots}
                </p>
              </div>
              <div className="p-2 space-y-0.5 bg-havelock-blue/5">
                <span className="text-sm text-muted-foreground">
                  Opportunity Type
                </span>
                <p className="text-sm font-medium">
                  {opportunity.opportunity_type}
                </p>
              </div>
            </div>
          </Card>

          {/* Developer Info */}
          <div className="space-y-3 p-3 rounded-md border bg-card">
            <div className="flex items-center gap-1.5 text-havelock-blue">
              <Building2 className="h-4 w-4" />
              <span className="text-sm font-semibold">
                Developer Information
              </span>
            </div>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-muted-foreground">Name</span>
                <p className="text-sm">{opportunity.developer_name}</p>
              </div>
              {opportunity.developer_region_names &&
                opportunity.developer_region_names.length > 0 && (
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Developer Regions
                    </span>
                    <p className="text-sm">
                      {opportunity.developer_region_names.join(", ")}
                    </p>
                  </div>
                )}
              {opportunity.developer_info && (
                <div>
                  <span className="text-sm text-muted-foreground">
                    Additional Info
                  </span>
                  <p className="text-sm whitespace-pre-wrap">
                    {opportunity.developer_info}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Location Info */}
          <div className="space-y-3 p-3 rounded-md border bg-card">
            <div className="flex items-center gap-1.5 text-havelock-blue">
              <Globe2 className="h-4 w-4" />
              <span className="text-sm font-semibold">
                Location Information
              </span>
            </div>

            <div className="space-y-2">
              <div>
                <span className="text-sm text-muted-foreground">Regions</span>
                <p className="text-sm">
                  {opportunity.region_names?.join(", ") || "Not specified"}
                </p>
              </div>

              <div>
                <span className="text-sm text-muted-foreground">
                  Local Planning Authorities
                </span>
                <p className="text-sm">
                  {opportunity.lpa_names?.join(", ") || "Not specified"}
                </p>
              </div>
            </div>
          </div>

          {/* Planning Info */}
          <div className="space-y-3 p-3 rounded-md border bg-card">
            <div className="flex items-center gap-1.5 text-havelock-blue">
              <ScrollText className="h-4 w-4" />
              <span className="text-sm font-semibold">
                Planning Information
              </span>
            </div>

            <div className="space-y-2">
              <div>
                <span className="text-sm text-muted-foreground">
                  Planning Status
                </span>
                <div className="">
                  <p className="text-sm">{opportunity.planning_status}</p>
                </div>
              </div>

              <div>
                <span className="text-sm text-muted-foreground">
                  Land Purchase Status
                </span>
                <div className="">
                  <p className="text-sm">{opportunity.land_purchase_status}</p>
                </div>
              </div>

              {(opportunity.planning_application_reference ||
                opportunity.planning_application_url) && (
                <div className="space-y-2">
                  {opportunity.planning_application_reference && (
                    <div>
                      <span className="text-sm text-muted-foreground">
                        Planning Reference
                      </span>
                      <p className="text-sm">
                        {opportunity.planning_application_reference}
                      </p>
                    </div>
                  )}
                  {opportunity.planning_application_url && (
                    <div>
                      <span className="text-sm text-muted-foreground">
                        Planning Application
                      </span>
                      {renderDocumentLink(
                        opportunity.planning_application_url,
                        "View Planning Application"
                      )}
                    </div>
                  )}
                </div>
              )}

              {opportunity.planning_overview && (
                <div>
                  <span className="text-sm text-muted-foreground">
                    Planning Overview
                  </span>
                  <p className="text-sm whitespace-pre-wrap">
                    {opportunity.planning_overview}
                  </p>
                </div>
              )}

              {opportunity.proposed_development && (
                <div>
                  <span className="text-sm text-muted-foreground">
                    Proposed Development
                  </span>
                  <p className="text-sm whitespace-pre-wrap">
                    {opportunity.proposed_development}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-3 p-3 rounded-md border bg-card">
            <div className="flex items-center gap-1.5 text-havelock-blue">
              <Calendar className="h-4 w-4" />
              <span className="text-sm font-semibold">Project Timeline</span>
            </div>

            <div className="space-y-2">
              {renderDateRow(
                "Planning Submission",
                opportunity.planningSubmissionDate
              )}
              {renderDateRow(
                "Planning Determination",
                opportunity.planningDeterminationDate
              )}
              {renderDateRow("Start on Site", opportunity.startOnSiteDate)}
              {renderDateRow(
                "First Golden Brick",
                opportunity.firstGoldenBrickDate
              )}
              {renderDateRow(
                "Final Golden Brick",
                opportunity.finalGoldenBrickDate
              )}
              {renderDateRow("First Handover", opportunity.firstHandoverDate)}
              {renderDateRow("Final Handover", opportunity.finalHandoverDate)}

              {opportunity.projectProgramme && (
                <div className="pt-2 border-t">
                  <span className="text-sm text-muted-foreground">
                    Project Programme
                  </span>
                  <p className="text-sm whitespace-pre-wrap">
                    {opportunity.projectProgramme}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Tenure Info */}
          <div className="space-y-3 p-3 rounded-md border bg-card">
            <div className="flex items-center gap-1.5 text-havelock-blue">
              <Home className="h-4 w-4" />
              <span className="text-sm font-semibold">Tenure Information</span>
            </div>

            <div className="space-y-2">
              <div>
                <span className="text-sm text-muted-foreground">Tenures</span>
                <p className="text-sm">
                  {Array.isArray(opportunity.tenures)
                    ? opportunity.tenures.join(", ")
                    : "Not specified"}
                </p>
              </div>

              {opportunity.detailedTenureAccommodation && (
                <div>
                  <span className="text-sm text-muted-foreground">
                    Detailed Tenure & Accommodation
                  </span>
                  <p className="text-sm whitespace-pre-wrap">
                    {opportunity.detailedTenureAccommodation}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Commercial Info */}
          <div className="space-y-3 p-3 rounded-md border bg-card">
            <div className="flex items-center gap-1.5 text-havelock-blue">
              <Store className="h-4 w-4" />
              <span className="text-sm font-semibold">
                Commercial Information
              </span>
            </div>

            <div className="space-y-2">
              {opportunity.paymentTerms && (
                <div>
                  <span className="text-sm text-muted-foreground">
                    Payment Terms
                  </span>
                  <p className="text-sm whitespace-pre-wrap">
                    {opportunity.paymentTerms}
                  </p>
                </div>
              )}

              {opportunity.vatPosition && (
                <div>
                  <span className="text-sm text-muted-foreground">
                    VAT Position
                  </span>
                  <p className="text-sm">{opportunity.vatPosition}</p>
                </div>
              )}

              {opportunity.agentTerms && (
                <div>
                  <span className="text-sm text-muted-foreground">
                    Agent Terms
                  </span>
                  <p className="text-sm whitespace-pre-wrap">
                    {opportunity.agentTerms}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Documents Section */}
          <div className="space-y-3 p-3 rounded-md border bg-card">
            <div className="flex items-center gap-1.5 text-havelock-blue">
              <FileText className="h-4 w-4" />
              <span className="text-sm font-semibold">Documents</span>
            </div>

            <div className="space-y-4">
              {opportunity.proposedSpecification && (
                <div>
                  <span className="text-sm text-muted-foreground">
                    Proposed Specification
                  </span>
                  {renderDocumentLink(
                    opportunity.proposedSpecification,
                    "View Specification"
                  )}
                </div>
              )}

              {opportunity.s106Agreement && (
                <div>
                  <span className="text-sm text-muted-foreground">
                    Section 106 Agreement
                  </span>
                  {renderDocumentLink(
                    opportunity.s106Agreement,
                    "View Section 106 Agreement"
                  )}
                </div>
              )}

              {opportunity.additional_documents?.length > 0 && (
                <div>
                  <span className="text-sm text-muted-foreground">
                    Additional Documents
                  </span>
                  <div className="space-y-2 mt-1">
                    {opportunity.additional_documents.map((doc, index) => (
                      <div key={index}>
                        {renderDocumentLink(doc.url, doc.name)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons - Fixed at bottom */}
      <div className="p-3 border-t bg-background/95 backdrop-blur-sm">
        <ActionButtons opportunity={opportunity} className="flex gap-2" />
      </div>
    </div>
  );
}
